<?php

namespace Src\Domain\Adp\Data;

use Illuminate\Support\Arr;
use Spatie\LaravelData\Data;

/**
 * Representacion normalizada (plana) de un trabajador de ADP Worker Demographics v2,
 * lista para el matching y para persistir en el staging de revision.
 */
class AdpWorkerData extends Data
{
    public function __construct(
        public string $aoid,
        public ?string $worker_id,
        public ?string $firstname,
        public ?string $lastname,
        /** @var string[] emails en minuscula (personales + de trabajo) */
        public array $emails,
        /** @var string[] telefonos en solo digitos (mobiles + landlines) */
        public array $phones,
        public ?string $status,
        public ?string $job_title,
        public ?string $department,
        public ?string $hire_date,
        public ?string $amazon_id,
        public ?string $manager_aoid,
    ) {
    }

    /**
     * Construye el DTO desde un worker crudo de /hr/v2/worker-demographics.
     * El "amazon driver id" se detecta automaticamente del customFieldGroup
     * (en ADP de este cliente viene como custom field "Transporter ID").
     */
    public static function fromAdp(array $worker): self
    {
        $emails = collect([
            ...Arr::pluck((array) data_get($worker, 'person.communication.emails', []), 'emailUri'),
            ...Arr::pluck((array) data_get($worker, 'businessCommunication.emails', []), 'emailUri'),
        ])->filter()->map(fn ($e) => mb_strtolower(trim($e)))->unique()->values()->all();

        $phones = collect([
            ...Arr::pluck((array) data_get($worker, 'person.communication.mobiles', []), 'formattedNumber'),
            ...Arr::pluck((array) data_get($worker, 'person.communication.landlines', []), 'formattedNumber'),
            ...Arr::pluck((array) data_get($worker, 'businessCommunication.mobiles', []), 'formattedNumber'),
            ...Arr::pluck((array) data_get($worker, 'businessCommunication.landlines', []), 'formattedNumber'),
        ])->map(fn ($p) => self::digits($p))->filter()->unique()->values()->all();

        $assignment = (array) data_get($worker, 'workAssignments.0', []);

        return new self(
            aoid: (string) data_get($worker, 'associateOID'),
            worker_id: data_get($worker, 'workerID.idValue'),
            firstname: data_get($worker, 'person.legalName.givenName'),
            lastname: data_get($worker, 'person.legalName.familyName1'),
            emails: $emails,
            phones: $phones,
            status: data_get($worker, 'workerStatus.statusCode.codeValue'),
            job_title: data_get($assignment, 'jobTitle'),
            department: self::department($assignment),
            hire_date: data_get($assignment, 'hireDate') ?? data_get($worker, 'workerDates.originalHireDate'),
            amazon_id: self::amazonId($worker),
            manager_aoid: data_get($assignment, 'reportsTo.0.associateOID'),
        );
    }

    public function primaryEmail(): ?string
    {
        return $this->emails[0] ?? null;
    }

    public function primaryPhone(): ?string
    {
        return $this->phones[0] ?? null;
    }

    public function fullNameKey(): ?string
    {
        $name = trim(mb_strtolower(trim((string) $this->firstname).' '.trim((string) $this->lastname)));

        return $name !== '' ? $name : null;
    }

    /** Ultimos 10 digitos, para comparar telefonos con distinto formato/prefijo. */
    public static function phoneKey(?string $value): ?string
    {
        $digits = self::digits($value);

        return $digits !== '' ? substr($digits, -10) : null;
    }

    public static function digits(?string $value): string
    {
        return preg_replace('/\D+/', '', (string) $value) ?? '';
    }

    private static function department(array $assignment): ?string
    {
        foreach ((array) data_get($assignment, 'homeOrganizationalUnits', []) as $unit) {
            $type = data_get($unit, 'typeCode.codeValue') ?? data_get($unit, 'typeCode.shortName');
            if (is_string($type) && str_contains(mb_strtolower($type), 'department')) {
                return data_get($unit, 'nameCode.shortName') ?? data_get($unit, 'nameCode.codeValue');
            }
        }

        return null;
    }

    /**
     * Extrae el "amazon driver id" del customFieldGroup (a nivel person o de la
     * primera work assignment). En el ADP de este cliente el campo se llama
     * "Transporter ID"; tambien aceptamos variantes con "amazon" o "driver id".
     */
    private static function amazonId(array $worker): ?string
    {
        $stringFields = [
            ...(array) data_get($worker, 'customFieldGroup.stringFields', []),
            ...(array) data_get($worker, 'workAssignments.0.customFieldGroup.stringFields', []),
        ];

        foreach ($stringFields as $f) {
            $name = mb_strtolower((string) (data_get($f, 'nameCode.codeValue') ?? data_get($f, 'nameCode.shortName')));
            $isAmazonId = str_contains($name, 'transporter')
                || str_contains($name, 'amazon')
                || str_contains($name, 'driver id');

            if ($isAmazonId && filled(data_get($f, 'stringValue'))) {
                return (string) data_get($f, 'stringValue');
            }
        }

        return null;
    }
}
