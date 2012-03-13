/**
 * Note that this does not do anything different from fTime yet.
 * @augments fTime
 * @constructor
 * @param {fTimestamp|Object|string|number|null} [datetime=null] The date/time
 *   to represent. <code>null</code> is interpreted as now.
 * @param {string|null} [timezone=null] The timezone for the date/time. This
 *   causes date/time to be interpreted as being in the specified timezone.
 * @return {fTimestamp} The timestamp object.
 */
var fTimestamp = function (datetime, timezone) {
  /**
   * @type string
   * @private
   */
  var defaultTimezone = date_default_timezone_get();
  /**
   * @type number
   * @private
   */
  var numberDatetime = parseInt(datetime, 10);
  /**
   * @type number
   * @private
   */
  var timestamp;

  if (timezone !== undefined) {
    if (!fTimestamp.isValidTimezone(timezone.toString())) {
      fCore.debug('The timezone specified, %s, is not a valid timezone.', timezone);
      return null;
    }
  }
  else if (datetime && datetime.timezone) {
    timezone = datetime.timezone;
  }
  else {
    timezone = defaultTimezone;
  }

  this.timezone = timezone;

  if (!datetime || datetime.toString().substr(0, 12).toUpperCase()  === 'CURRENT_TIME') {
    timestamp = (new Date()).getTime() / 1000;
  }
  else if (!isNaN(numberDatetime) && datetime.toString().match(/^\-?\d+$/)) {
    timestamp = numberDatetime;
  }
  else if (datetime.timestamp) {
    timestamp = datetime.timestamp;
  }
  else if (datetime.toString().toUpperCase() === 'CURRENT_DATE') {
    var date = new Date();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();

    if (day.length < 2) {
      day = '0' + day;
    }
    if (month.length < 2) {
      month = '0' + month;
    }

    timestamp = +strtotime(date.getFullYear() + '-' + month + '-' + day);
  }
//   else {
//     if (typeof datetime === 'object') {
//       if (datetime.getTime) { // Handle if a Date object is passed
//         timestamp = date.getTime() / 1000;
//       }
//       else if (datetime.toString || numberDatetime === datetime) {
//         datetime = date.toString();
//       }
//
//       // datetime = fTimestamp.callUnformatCallback(datetime);
//
//       if (timezone !== defaultTimezone) {
//
//       }
//
//       timestamp = strtotime(fTimestamp.fixISOWeek(datetime));
//
//       if (timezone !== defaultTimezone) {
//
//       }
//     }
//   }

  if (timestamp === false) {
    fCore.debug('The date/time specified, %s, does not appear to be a valid date/time', datetime.toString());
    return null;
  }

  /**
   * @type {number}
   */
  this.timestamp = parseInt(timestamp, 10);

  return this;
};
/**
 * Valid timezones.
 * @type Object
 * @private
 */
fTimestamp._validTimezones = {
  'UTC': 1,
  'Africa/Abidjan': 1,
  'Africa/Accra': 1,
  'Africa/Addis_Ababa': 1,
  'Africa/Algiers': 1,
  'Africa/Asmara': 1,
  'Africa/Asmera': 1,
  'Africa/Bamako': 1,
  'Africa/Bangui': 1,
  'Africa/Banjul': 1,
  'Africa/Bissau': 1,
  'Africa/Blantyre': 1,
  'Africa/Brazzaville': 1,
  'Africa/Bujumbura': 1,
  'Africa/Cairo': 1,
  'Africa/Casablanca': 1,
  'Africa/Ceuta': 1,
  'Africa/Conakry': 1,
  'Africa/Dakar': 1,
  'Africa/Dar_es_Salaam': 1,
  'Africa/Djibouti': 1,
  'Africa/Douala': 1,
  'Africa/El_Aaiun': 1,
  'Africa/Freetown': 1,
  'Africa/Gaborone': 1,
  'Africa/Harare': 1,
  'Africa/Johannesburg': 1,
  'Africa/Kampala': 1,
  'Africa/Khartoum': 1,
  'Africa/Kigali': 1,
  'Africa/Kinshasa': 1,
  'Africa/Lagos': 1,
  'Africa/Libreville': 1,
  'Africa/Lome': 1,
  'Africa/Luanda': 1,
  'Africa/Lubumbashi': 1,
  'Africa/Lusaka': 1,
  'Africa/Malabo': 1,
  'Africa/Maputo': 1,
  'Africa/Maseru': 1,
  'Africa/Mbabane': 1,
  'Africa/Mogadishu': 1,
  'Africa/Monrovia': 1,
  'Africa/Nairobi': 1,
  'Africa/Ndjamena': 1,
  'Africa/Niamey': 1,
  'Africa/Nouakchott': 1,
  'Africa/Ouagadougou': 1,
  'Africa/Porto-Novo': 1,
  'Africa/Sao_Tome': 1,
  'Africa/Timbuktu': 1,
  'Africa/Tripoli': 1,
  'Africa/Tunis': 1,
  'Africa/Windhoek': 1,
  'America/Adak': 1,
  'America/Anchorage': 1,
  'America/Anguilla': 1,
  'America/Antigua': 1,
  'America/Araguaina': 1,
  'America/Argentina/Buenos_Aires': 1,
  'America/Argentina/Catamarca': 1,
  'America/Argentina/ComodRivadavia': 1,
  'America/Argentina/Cordoba': 1,
  'America/Argentina/Jujuy': 1,
  'America/Argentina/La_Rioja': 1,
  'America/Argentina/Mendoza': 1,
  'America/Argentina/Rio_Gallegos': 1,
  'America/Argentina/San_Juan': 1,
  'America/Argentina/San_Luis': 1,
  'America/Argentina/Tucuman': 1,
  'America/Argentina/Ushuaia': 1,
  'America/Aruba': 1,
  'America/Asuncion': 1,
  'America/Atikokan': 1,
  'America/Atka': 1,
  'America/Bahia': 1,
  'America/Barbados': 1,
  'America/Belem': 1,
  'America/Belize': 1,
  'America/Blanc-Sablon': 1,
  'America/Boa_Vista': 1,
  'America/Bogota': 1,
  'America/Boise': 1,
  'America/Buenos_Aires': 1,
  'America/Cambridge_Bay': 1,
  'America/Campo_Grande': 1,
  'America/Cancun': 1,
  'America/Caracas': 1,
  'America/Catamarca': 1,
  'America/Cayenne': 1,
  'America/Cayman': 1,
  'America/Chicago': 1,
  'America/Chihuahua': 1,
  'America/Coral_Harbour': 1,
  'America/Cordoba': 1,
  'America/Costa_Rica': 1,
  'America/Cuiaba': 1,
  'America/Curacao': 1,
  'America/Danmarkshavn': 1,
  'America/Dawson': 1,
  'America/Dawson_Creek': 1,
  'America/Denver': 1,
  'America/Detroit': 1,
  'America/Dominica': 1,
  'America/Edmonton': 1,
  'America/Eirunepe': 1,
  'America/El_Salvador': 1,
  'America/Ensenada': 1,
  'America/Fort_Wayne': 1,
  'America/Fortaleza': 1,
  'America/Glace_Bay': 1,
  'America/Godthab': 1,
  'America/Goose_Bay': 1,
  'America/Grand_Turk': 1,
  'America/Grenada': 1,
  'America/Guadeloupe': 1,
  'America/Guatemala': 1,
  'America/Guayaquil': 1,
  'America/Guyana': 1,
  'America/Halifax': 1,
  'America/Havana': 1,
  'America/Hermosillo': 1,
  'America/Indiana/Indianapolis': 1,
  'America/Indiana/Knox': 1,
  'America/Indiana/Marengo': 1,
  'America/Indiana/Petersburg': 1,
  'America/Indiana/Tell_City': 1,
  'America/Indiana/Vevay': 1,
  'America/Indiana/Vincennes': 1,
  'America/Indiana/Winamac': 1,
  'America/Indianapolis': 1,
  'America/Inuvik': 1,
  'America/Iqaluit': 1,
  'America/Jamaica': 1,
  'America/Jujuy': 1,
  'America/Juneau': 1,
  'America/Kentucky/Louisville': 1,
  'America/Kentucky/Monticello': 1,
  'America/Knox_IN': 1,
  'America/La_Paz': 1,
  'America/Lima': 1,
  'America/Los_Angeles': 1,
  'America/Louisville': 1,
  'America/Maceio': 1,
  'America/Managua': 1,
  'America/Manaus': 1,
  'America/Marigot': 1,
  'America/Martinique': 1,
  'America/Mazatlan': 1,
  'America/Mendoza': 1,
  'America/Menominee': 1,
  'America/Merida': 1,
  'America/Mexico_City': 1,
  'America/Miquelon': 1,
  'America/Moncton': 1,
  'America/Monterrey': 1,
  'America/Montevideo': 1,
  'America/Montreal': 1,
  'America/Montserrat': 1,
  'America/Nassau': 1,
  'America/New_York': 1,
  'America/Nipigon': 1,
  'America/Nome': 1,
  'America/Noronha': 1,
  'America/North_Dakota/Center': 1,
  'America/North_Dakota/New_Salem': 1,
  'America/Panama': 1,
  'America/Pangnirtung': 1,
  'America/Paramaribo': 1,
  'America/Phoenix': 1,
  'America/Port-au-Prince': 1,
  'America/Port_of_Spain': 1,
  'America/Porto_Acre': 1,
  'America/Porto_Velho': 1,
  'America/Puerto_Rico': 1,
  'America/Rainy_River': 1,
  'America/Rankin_Inlet': 1,
  'America/Recife': 1,
  'America/Regina': 1,
  'America/Resolute': 1,
  'America/Rio_Branco': 1,
  'America/Rosario': 1,
  'America/Santiago': 1,
  'America/Santo_Domingo': 1,
  'America/Sao_Paulo': 1,
  'America/Scoresbysund': 1,
  'America/Shiprock': 1,
  'America/St_Barthelemy': 1,
  'America/St_Johns': 1,
  'America/St_Kitts': 1,
  'America/St_Lucia': 1,
  'America/St_Thomas': 1,
  'America/St_Vincent': 1,
  'America/Swift_Current': 1,
  'America/Tegucigalpa': 1,
  'America/Thule': 1,
  'America/Thunder_Bay': 1,
  'America/Tijuana': 1,
  'America/Toronto': 1,
  'America/Tortola': 1,
  'America/Vancouver': 1,
  'America/Virgin': 1,
  'America/Whitehorse': 1,
  'America/Winnipeg': 1,
  'America/Yakutat': 1,
  'America/Yellowknife': 1,
  'Antarctica/Casey': 1,
  'Antarctica/Davis': 1,
  'Antarctica/DumontDUrville': 1,
  'Antarctica/Mawson': 1,
  'Antarctica/McMurdo': 1,
  'Antarctica/Palmer': 1,
  'Antarctica/Rothera': 1,
  'Antarctica/South_Pole': 1,
  'Antarctica/Syowa': 1,
  'Antarctica/Vostok': 1,
  'Arctic/Longyearbyen': 1,
  'Asia/Aden': 1,
  'Asia/Almaty': 1,
  'Asia/Amman': 1,
  'Asia/Anadyr': 1,
  'Asia/Aqtau': 1,
  'Asia/Aqtobe': 1,
  'Asia/Ashgabat': 1,
  'Asia/Ashkhabad': 1,
  'Asia/Baghdad': 1,
  'Asia/Bahrain': 1,
  'Asia/Baku': 1,
  'Asia/Bangkok': 1,
  'Asia/Beirut': 1,
  'Asia/Bishkek': 1,
  'Asia/Brunei': 1,
  'Asia/Calcutta': 1,
  'Asia/Choibalsan': 1,
  'Asia/Chongqing': 1,
  'Asia/Chungking': 1,
  'Asia/Colombo': 1,
  'Asia/Dacca': 1,
  'Asia/Damascus': 1,
  'Asia/Dhaka': 1,
  'Asia/Dili': 1,
  'Asia/Dubai': 1,
  'Asia/Dushanbe': 1,
  'Asia/Gaza': 1,
  'Asia/Harbin': 1,
  'Asia/Ho_Chi_Minh': 1,
  'Asia/Hong_Kong': 1,
  'Asia/Hovd': 1,
  'Asia/Irkutsk': 1,
  'Asia/Istanbul': 1,
  'Asia/Jakarta': 1,
  'Asia/Jayapura': 1,
  'Asia/Jerusalem': 1,
  'Asia/Kabul': 1,
  'Asia/Kamchatka': 1,
  'Asia/Karachi': 1,
  'Asia/Kashgar': 1,
  'Asia/Katmandu': 1,
  'Asia/Kolkata': 1,
  'Asia/Krasnoyarsk': 1,
  'Asia/Kuala_Lumpur': 1,
  'Asia/Kuching': 1,
  'Asia/Kuwait': 1,
  'Asia/Macao': 1,
  'Asia/Macau': 1,
  'Asia/Magadan': 1,
  'Asia/Makassar': 1,
  'Asia/Manila': 1,
  'Asia/Muscat': 1,
  'Asia/Nicosia': 1,
  'Asia/Novosibirsk': 1,
  'Asia/Omsk': 1,
  'Asia/Oral': 1,
  'Asia/Phnom_Penh': 1,
  'Asia/Pontianak': 1,
  'Asia/Pyongyang': 1,
  'Asia/Qatar': 1,
  'Asia/Qyzylorda': 1,
  'Asia/Rangoon': 1,
  'Asia/Riyadh': 1,
  'Asia/Saigon': 1,
  'Asia/Sakhalin': 1,
  'Asia/Samarkand': 1,
  'Asia/Seoul': 1,
  'Asia/Shanghai': 1,
  'Asia/Singapore': 1,
  'Asia/Taipei': 1,
  'Asia/Tashkent': 1,
  'Asia/Tbilisi': 1,
  'Asia/Tehran': 1,
  'Asia/Tel_Aviv': 1,
  'Asia/Thimbu': 1,
  'Asia/Thimphu': 1,
  'Asia/Tokyo': 1,
  'Asia/Ujung_Pandang': 1,
  'Asia/Ulaanbaatar': 1,
  'Asia/Ulan_Bator': 1,
  'Asia/Urumqi': 1,
  'Asia/Vientiane': 1,
  'Asia/Vladivostok': 1,
  'Asia/Yakutsk': 1,
  'Asia/Yekaterinburg': 1,
  'Asia/Yerevan': 1,
  'Atlantic/Azores': 1,
  'Atlantic/Bermuda': 1,
  'Atlantic/Canary': 1,
  'Atlantic/Cape_Verde': 1,
  'Atlantic/Faeroe': 1,
  'Atlantic/Faroe': 1,
  'Atlantic/Jan_Mayen': 1,
  'Atlantic/Madeira': 1,
  'Atlantic/Reykjavik': 1,
  'Atlantic/South_Georgia': 1,
  'Atlantic/St_Helena': 1,
  'Atlantic/Stanley': 1,
  'Australia/ACT': 1,
  'Australia/Adelaide': 1,
  'Australia/Brisbane': 1,
  'Australia/Broken_Hill': 1,
  'Australia/Canberra': 1,
  'Australia/Currie': 1,
  'Australia/Darwin': 1,
  'Australia/Eucla': 1,
  'Australia/Hobart': 1,
  'Australia/LHI': 1,
  'Australia/Lindeman': 1,
  'Australia/Lord_Howe': 1,
  'Australia/Melbourne': 1,
  'Australia/North': 1,
  'Australia/NSW': 1,
  'Australia/Perth': 1,
  'Australia/Queensland': 1,
  'Australia/South': 1,
  'Australia/Sydney': 1,
  'Australia/Tasmania': 1,
  'Australia/Victoria': 1,
  'Australia/West': 1,
  'Australia/Yancowinna': 1,
  'Europe/Amsterdam': 1,
  'Europe/Andorra': 1,
  'Europe/Athens': 1,
  'Europe/Belfast': 1,
  'Europe/Belgrade': 1,
  'Europe/Berlin': 1,
  'Europe/Bratislava': 1,
  'Europe/Brussels': 1,
  'Europe/Bucharest': 1,
  'Europe/Budapest': 1,
  'Europe/Chisinau': 1,
  'Europe/Copenhagen': 1,
  'Europe/Dublin': 1,
  'Europe/Gibraltar': 1,
  'Europe/Guernsey': 1,
  'Europe/Helsinki': 1,
  'Europe/Isle_of_Man': 1,
  'Europe/Istanbul': 1,
  'Europe/Jersey': 1,
  'Europe/Kaliningrad': 1,
  'Europe/Kiev': 1,
  'Europe/Lisbon': 1,
  'Europe/Ljubljana': 1,
  'Europe/London': 1,
  'Europe/Luxembourg': 1,
  'Europe/Madrid': 1,
  'Europe/Malta': 1,
  'Europe/Mariehamn': 1,
  'Europe/Minsk': 1,
  'Europe/Monaco': 1,
  'Europe/Moscow': 1,
  'Europe/Nicosia': 1,
  'Europe/Oslo': 1,
  'Europe/Paris': 1,
  'Europe/Podgorica': 1,
  'Europe/Prague': 1,
  'Europe/Riga': 1,
  'Europe/Rome': 1,
  'Europe/Samara': 1,
  'Europe/San_Marino': 1,
  'Europe/Sarajevo': 1,
  'Europe/Simferopol': 1,
  'Europe/Skopje': 1,
  'Europe/Sofia': 1,
  'Europe/Stockholm': 1,
  'Europe/Tallinn': 1,
  'Europe/Tirane': 1,
  'Europe/Tiraspol': 1,
  'Europe/Uzhgorod': 1,
  'Europe/Vaduz': 1,
  'Europe/Vatican': 1,
  'Europe/Vienna': 1,
  'Europe/Vilnius': 1,
  'Europe/Volgograd': 1,
  'Europe/Warsaw': 1,
  'Europe/Zagreb': 1,
  'Europe/Zaporozhye': 1,
  'Europe/Zurich': 1,
  'Indian/Antananarivo': 1,
  'Indian/Chagos': 1,
  'Indian/Christmas': 1,
  'Indian/Cocos': 1,
  'Indian/Comoro': 1,
  'Indian/Kerguelen': 1,
  'Indian/Mahe': 1,
  'Indian/Maldives': 1,
  'Indian/Mauritius': 1,
  'Indian/Mayotte': 1,
  'Indian/Reunion': 1,
  'Pacific/Apia': 1,
  'Pacific/Auckland': 1,
  'Pacific/Chatham': 1,
  'Pacific/Easter': 1,
  'Pacific/Efate': 1,
  'Pacific/Enderbury': 1,
  'Pacific/Fakaofo': 1,
  'Pacific/Fiji': 1,
  'Pacific/Funafuti': 1,
  'Pacific/Galapagos': 1,
  'Pacific/Gambier': 1,
  'Pacific/Guadalcanal': 1,
  'Pacific/Guam': 1,
  'Pacific/Honolulu': 1,
  'Pacific/Johnston': 1,
  'Pacific/Kiritimati': 1,
  'Pacific/Kosrae': 1,
  'Pacific/Kwajalein': 1,
  'Pacific/Majuro': 1,
  'Pacific/Marquesas': 1,
  'Pacific/Midway': 1,
  'Pacific/Nauru': 1,
  'Pacific/Niue': 1,
  'Pacific/Norfolk': 1,
  'Pacific/Noumea': 1,
  'Pacific/Pago_Pago': 1,
  'Pacific/Palau': 1,
  'Pacific/Pitcairn': 1,
  'Pacific/Ponape': 1,
  'Pacific/Port_Moresby': 1,
  'Pacific/Rarotonga': 1,
  'Pacific/Saipan': 1,
  'Pacific/Samoa': 1,
  'Pacific/Tahiti': 1,
  'Pacific/Tarawa': 1,
  'Pacific/Tongatapu': 1,
  'Pacific/Truk': 1,
  'Pacific/Wake': 1,
  'Pacific/Wallis': 1
};
/**
 * Check if the timezone string is valid.
 * @param {string} timezone
 * @returns {boolean} If the timezone string is valid.
 */
fTimestamp.isValidTimezone = function (timezone) {
  return fTimestamp._validTimezones[timezone] !== undefined;
};
/**
 * @const
 * @type Object
 * @private
 */
fTimestamp._breakPoints =  {
  45:         [1, 'second', 'seconds'],
  2700:       [60, 'minute', 'minutes'],
  64800:      [3600, 'hour', 'hours'],
  432000:     [86400, 'day', 'days'],
  1814400:    [604800, 'week', 'weeks'],
  23328000:   [2592000, 'month', 'months'],
  2147483647: [31536000, 'year', 'years']
};
/**
 * Returns the approximate difference in time, discarding any unit of measure
 *   but the least specific.
 * @param {fTimestamp|Date|string|number|null} [otherTimestamp] The timestamp
 *   to compare with. If not specified or null, compares against 'now'.
 * @param {boolean} [simple=false] When true, the returned value will include
 *   the difference in the two timestamps, but not 'from now', 'ago', 'after', or 'before'.
 * @return {string} The fuzzy time in English.
 */
fTimestamp.prototype.getFuzzyDifference = function (otherTimestamp, simple) {
  // Does not support having simple be the first argument

  var relativeToNow = false;
  if (!otherTimestamp) {
    relativeToNow = true;
  }
  otherTimestamp = new fTimestamp(otherTimestamp);

  return (function (breakPoints, value, otherValue) {
    var diff = value.timestamp - otherTimestamp.timestamp;
    var unitDiff = 0, units = 'seconds';

    if (Math.abs(diff) < 10) {
      if (relativeToNow) {
        return 'right now';
      }
      return 'at the same time';
    }

    for (var point in breakPoints) {
      if (breakPoints.hasOwnProperty(point)) {
        if (Math.abs(diff) > point) {
          continue;
        }

        unitDiff = Math.round(Math.abs(diff) / breakPoints[point][0]);
        units = fGrammar.inflectOnQuanity(unitDiff, breakPoints[point][1], breakPoints[point][2]);
        break;
      }
    }

    var prefix = '%1$s %2$s';

    if (simple) {
      return sprintf(prefix, unitDiff, units);
    }

    if (relativeToNow) {
      if (diff < 0) { // PHP has >
        return sprintf(prefix + ' from now', unitDiff, units);
      }
      return sprintf(prefix + ' ago', unitDiff, units);
    }

    if (diff < 0) {
      return sprintf(prefix + ' after', unitDiff, units);
    }

    return sprintf(prefix + ' before', unitDiff, units);
  })(fTimestamp._breakPoints, this, otherTimestamp);
};
