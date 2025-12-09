<?php

namespace Src\Auth\Request;

use Illuminate\Foundation\Http\FormRequest;

class SetPasswordActionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;

    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'password' => 'required|string',

        ];
    }
}
