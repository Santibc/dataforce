<?php

namespace Src\Application\Admin\Metrics\Resource;

use Spatie\LaravelData\Data;

class QualityResource extends Data
{
    public function __construct(
        public ?string $value,
        public ?string $customer_delivery_experience,
        public ?string $customer_escalation_defect,
        public ?string $customer_delivery_feedback,
        public ?string $delivery_completion_rate,
        public ?string $delivered_and_received,
        public ?string $standard_work_compliance,
        public ?string $photo_on_delivery,
        public ?string $contact_compliance,
        public ?string $attended_delivery_accuracy,
        public ?int $week,
        public ?int $year,
    ) {}
}
