<?php

use chums\ui\WebUI2;
use chums\user\Groups;

require_once "autoload.inc.php";

$ui = new WebUI2([
    'bodyClassName' => 'container-fluid',
    'title' => 'EDI Order Status',
    'requiredRoles' => [Groups::PRODUCTION, Groups::CS],
]);
$ui->addManifestJSON('public/js/manifest.json')
    ->render();
