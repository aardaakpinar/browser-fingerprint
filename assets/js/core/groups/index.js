// Display order. Each group module exports:
//   id    – fixed id, also the i18n key suffix (group.<id>) and the hash key prefix
//   load  – optional async setup; its result is passed to every row's get()
//   rows  – [{ id, type, unit?, volatile?, get(data) }]
// Row types: text | num | size | bool | enum | list | flags | pairs | states
// Return nothing (or throw) from get() when a value is unavailable. Labels live in i18n/locales/.
import browser from "./browser.js";
import screen from "./screen.js";
import hardware from "./hardware.js";
import connection from "./connection.js";
import battery from "./battery.js";
import identity from "./identity.js";
import devices from "./devices.js";
import capabilities from "./capabilities.js";
import locale from "./locale.js";
import automation from "./automation.js";
import graphics from "./graphics.js";
import fonts from "./fonts.js";

export default [browser, screen, hardware, connection, battery, identity, devices, capabilities, locale, automation, graphics, fonts];
