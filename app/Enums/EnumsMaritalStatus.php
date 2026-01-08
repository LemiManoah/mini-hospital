<?php

namespace App\Enums;

enum EnumsMaritalStatus : string
{
    case SINGLE = 'single';
    case MARRIED = 'married';
    case DIVORCED = 'divorced';
    case WIDOWED = 'widowed';
    case SEPARATED = 'separated';
    case OTHER = 'other';
}
