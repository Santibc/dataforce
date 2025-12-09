<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {

        });

        $this->renderable(function (HttpExceptionInterface $e, Request $request) {
                return response()->json(['messages' => [$e->getMessage()], 'code' => $e->getStatusCode()], $e->getStatusCode())->setStatusCode($e->getStatusCode());
        });
        $this->renderable(function (ValidationException $e, Request $request) {

            $messages = $e->validator->getMessageBag()->getMessages();
            $mappedMessages = [];
            foreach ($messages as $message)
                foreach ($message as $errorMessage)
                    $mappedMessages[] =  $errorMessage;

            return response()->json(['messages' => $mappedMessages, 'code' => 422], 422)->setStatusCode(422);
        });
    }
}
