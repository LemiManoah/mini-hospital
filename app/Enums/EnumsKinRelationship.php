<?php

namespace App\Enums;

enum EnumsKinRelationship : string
{
    case PARENT = 'parent';
    case SIBLING = 'sibling';
    case SPOUSE = 'spouse';
    case CHILD = 'child';
    case RELATIVE = 'relative';
    case FRIEND = 'friend';
    case OTHER = 'other';
}
