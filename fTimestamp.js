/**
 * Represents a date and time as a value object.
 * @constructor
 * @param {fTimestamp|Object|string|number|Date|null} [datetime=null] The
 *   date/time to represent. <code>null</code> is interpreted as now.
 * @param {string|null} [timezone=null] The timezone for the date/time. This
 *   causes date/time to be interpreted as being in the specified timezone.
 * @return {fTimestamp} The timestamp object.
 */
var fTimestamp = function (datetime, timezone) {
  /**
   * @type string
   * @private
   */
  var defaultTimezone = fTimestamp.getDefaultTimezone();
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
  else {
    if (typeof datetime === 'object') {
      if (datetime.getTime) { // Handle if a Date object is passed
        timestamp = datetime.getTime() / 1000;
      }
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
    }
  }

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
 * The default time zone if set.
 * @type (string|null)
 * @private
 */
fTimestamp._defaultTimezone = null;
/**
 * Valid timezones.
 * @type Object
 * @private
 */
fTimestamp._validTimezones = (function () {
  var ret = {'UTC': 1, 'Arctic/Longyearbyen': 1};

  var africa = [
    'Abidjan',
    'Accra',
    'Addis_Ababa',
    'Algiers',
    'Asmara',
    'Asmera',
    'Bamako',
    'Bangui',
    'Banjul',
    'Bissau',
    'Blantyre',
    'Brazzaville',
    'Bujumbura',
    'Cairo',
    'Casablanca',
    'Ceuta',
    'Conakry',
    'Dakar',
    'Dar_es_Salaam',
    'Djibouti',
    'Douala',
    'El_Aaiun',
    'Freetown',
    'Gaborone',
    'Harare',
    'Johannesburg',
    'Kampala',
    'Khartoum',
    'Kigali',
    'Kinshasa',
    'Lagos',
    'Libreville',
    'Lome',
    'Luanda',
    'Lubumbashi',
    'Lusaka',
    'Malabo',
    'Maputo',
    'Maseru',
    'Mbabane',
    'Mogadishu',
    'Monrovia',
    'Nairobi',
    'Ndjamena',
    'Niamey',
    'Nouakchott',
    'Ouagadougou',
    'Porto-Novo',
    'Sao_Tome',
    'Timbuktu',
    'Tripoli',
    'Tunis',
    'Windhoek'
  ];

  var america = [
    'Adak',
    'Anchorage',
    'Anguilla',
    'Antigua',
    'Araguaina',
    'Aruba',
    'Asuncion',
    'Atikokan',
    'Atka',
    'Bahia',
    'Barbados',
    'Belem',
    'Belize',
    'Blanc-Sablon',
    'Boa_Vista',
    'Bogota',
    'Boise',
    'Buenos_Aires',
    'Cambridge_Bay',
    'Campo_Grande',
    'Cancun',
    'Caracas',
    'Catamarca',
    'Cayenne',
    'Cayman',
    'Chicago',
    'Chihuahua',
    'Coral_Harbour',
    'Cordoba',
    'Costa_Rica',
    'Cuiaba',
    'Curacao',
    'Danmarkshavn',
    'Dawson',
    'Dawson_Creek',
    'Denver',
    'Detroit',
    'Dominica',
    'Edmonton',
    'Eirunepe',
    'El_Salvador',
    'Ensenada',
    'Fort_Wayne',
    'Fortaleza',
    'Glace_Bay',
    'Godthab',
    'Goose_Bay',
    'Grand_Turk',
    'Grenada',
    'Guadeloupe',
    'Guatemala',
    'Guayaquil',
    'Guyana',
    'Halifax',
    'Havana',
    'Inuvik',
    'Iqaluit',
    'Jamaica',
    'Jujuy',
    'Juneau',
    'Knox_IN',
    'La_Paz',
    'Lima',
    'Los_Angeles',
    'Louisville',
    'Maceio',
    'Managua',
    'Manaus',
    'Marigot',
    'Martinique',
    'Mazatlan',
    'Mendoza',
    'Menominee',
    'Merida',
    'Mexico_City',
    'Miquelon',
    'Moncton',
    'Monterrey',
    'Montevideo',
    'Montreal',
    'Montserrat',
    'Nassau',
    'New_York',
    'Nipigon',
    'Nome',
    'Noronha',
    'Panama',
    'Pangnirtung',
    'Paramaribo',
    'Phoenix',
    'Port-au-Prince',
    'Port_of_Spain',
    'Porto_Acre',
    'Porto_Velho',
    'Puerto_Rico',
    'Rainy_River',
    'Rankin_Inlet',
    'Recife',
    'Regina',
    'Resolute',
    'Rio_Branco',
    'Rosario',
    'Santiago',
    'Santo_Domingo',
    'Sao_Paulo',
    'Scoresbysund',
    'Shiprock',
    'St_Barthelemy',
    'St_Johns',
    'St_Kitts',
    'St_Lucia',
    'St_Thomas',
    'St_Vincent',
    'Swift_Current',
    'Tegucigalpa',
    'Thule',
    'Thunder_Bay',
    'Tijuana',
    'Toronto',
    'Tortola',
    'Vancouver',
    'Virgin',
    'Whitehorse',
    'Winnipeg',
    'Yakutat',
    'Yellowknife'
  ];

  var americaArgentina = [
    'Buenos_Aires',
    'Catamarca',
    'ComodRivadavia',
    'Cordoba',
    'Jujuy',
    'La_Rioja',
    'Mendoza',
    'Rio_Gallegos',
    'San_Juan',
    'San_Luis',
    'Tucuman',
    'Ushuaia'
  ];

  var americaIndiana = [
    'Indianapolis',
    'Knox',
    'Marengo',
    'Petersburg',
    'Tell_City',
    'Vevay',
    'Vincennes',
    'Winamac'
  ];

  var americaKentucky = [
    'Louisville',
    'Monticello'
  ];

  var americaNorthDakota = [
    'Center',
    'New_Salem'
  ];

  var antarctica = [
    'Casey',
    'Davis',
    'DumontDUrville',
    'Mawson',
    'McMurdo',
    'Palmer',
    'Rothera',
    'South_Pole',
    'Syowa',
    'Vostok'
  ];

  var asia = [
    'Aden',
    'Almaty',
    'Amman',
    'Anadyr',
    'Aqtau',
    'Aqtobe',
    'Ashgabat',
    'Ashkhabad',
    'Baghdad',
    'Bahrain',
    'Baku',
    'Bangkok',
    'Beirut',
    'Bishkek',
    'Brunei',
    'Calcutta',
    'Choibalsan',
    'Chongqing',
    'Chungking',
    'Colombo',
    'Dacca',
    'Damascus',
    'Dhaka',
    'Dili',
    'Dubai',
    'Dushanbe',
    'Gaza',
    'Harbin',
    'Ho_Chi_Minh',
    'Hong_Kong',
    'Hovd',
    'Irkutsk',
    'Istanbul',
    'Jakarta',
    'Jayapura',
    'Jerusalem',
    'Kabul',
    'Kamchatka',
    'Karachi',
    'Kashgar',
    'Katmandu',
    'Kolkata',
    'Krasnoyarsk',
    'Kuala_Lumpur',
    'Kuching',
    'Kuwait',
    'Macao',
    'Macau',
    'Magadan',
    'Makassar',
    'Manila',
    'Muscat',
    'Nicosia',
    'Novosibirsk',
    'Omsk',
    'Oral',
    'Phnom_Penh',
    'Pontianak',
    'Pyongyang',
    'Qatar',
    'Qyzylorda',
    'Rangoon',
    'Riyadh',
    'Saigon',
    'Sakhalin',
    'Samarkand',
    'Seoul',
    'Shanghai',
    'Singapore',
    'Taipei',
    'Tashkent',
    'Tbilisi',
    'Tehran',
    'Tel_Aviv',
    'Thimbu',
    'Thimphu',
    'Tokyo'
  ];

  var atlantic = [
    'Azores',
    'Bermuda',
    'Canary',
    'Cape_Verde',
    'Faeroe',
    'Faroe',
    'Jan_Mayen',
    'Madeira',
    'Reykjavik',
    'South_Georgia',
    'St_Helena',
    'Stanley'
  ];

  var australia = [
    'ACT',
    'Adelaide',
    'Brisbane',
    'Broken_Hill',
    'Canberra',
    'Currie',
    'Darwin',
    'Eucla',
    'Hobart',
    'LHI',
    'Lindeman',
    'Lord_Howe',
    'Melbourne',
    'North',
    'NSW',
    'Perth',
    'Queensland',
    'South',
    'Sydney',
    'Tasmania',
    'Victoria',
    'West',
    'Yancowinna'
  ];

  var europe = [
    'Amsterdam',
    'Andorra',
    'Athens',
    'Belfast',
    'Belgrade',
    'Berlin',
    'Bratislava',
    'Brussels',
    'Bucharest',
    'Budapest',
    'Chisinau',
    'Copenhagen',
    'Dublin',
    'Gibraltar',
    'Guernsey',
    'Helsinki',
    'Isle_of_Man',
    'Istanbul',
    'Jersey',
    'Kaliningrad',
    'Kiev',
    'Lisbon',
    'Ljubljana',
    'London',
    'Luxembourg',
    'Madrid',
    'Malta',
    'Mariehamn',
    'Minsk',
    'Monaco',
    'Moscow',
    'Nicosia',
    'Oslo',
    'Paris',
    'Podgorica',
    'Prague',
    'Riga',
    'Rome',
    'Samara',
    'San_Marino',
    'Sarajevo',
    'Simferopol',
    'Skopje',
    'Sofia',
    'Stockholm',
    'Tallinn',
    'Tirane',
    'Tiraspol',
    'Uzhgorod',
    'Vaduz',
    'Vatican',
    'Vienna',
    'Vilnius',
    'Volgograd',
    'Warsaw',
    'Zagreb',
    'Zaporozhye',
    'Zurich'
  ];

  var indian = [
    'Antananarivo',
    'Chagos',
    'Christmas',
    'Cocos',
    'Comoro',
    'Kerguelen',
    'Mahe',
    'Maldives',
    'Mauritius',
    'Mayotte',
    'Reunion'
  ];

  var pacific = [
    'Apia',
    'Auckland',
    'Chatham',
    'Easter',
    'Efate',
    'Enderbury',
    'Fakaofo',
    'Fiji',
    'Funafuti',
    'Galapagos',
    'Gambier',
    'Guadalcanal',
    'Guam',
    'Honolulu',
    'Johnston',
    'Kiritimati',
    'Kosrae',
    'Kwajalein',
    'Majuro',
    'Marquesas',
    'Midway',
    'Nauru',
    'Niue',
    'Norfolk',
    'Noumea',
    'Pago_Pago',
    'Palau',
    'Pitcairn',
    'Ponape',
    'Port_Moresby',
    'Rarotonga',
    'Saipan',
    'Samoa',
    'Tahiti',
    'Tarawa',
    'Tongatapu',
    'Truk',
    'Wake',
    'Wallis'
  ];

  var all = {
    'Africa/': africa,
    'America/': america,
    'America/Argentina/': americaArgentina,
    'America/Indiana/': americaIndiana,
    'America/Kentucky/': americaKentucky,
    'America/North_Dakota/': americaNorthDakota,
    'Antarctica/': antarctica,
    'Asia/': asia,
    'Atlantic/': atlantic,
    'Australia/': australia,
    'Europe/': europe,
    'Indian/': indian,
    'Pacific/': pacific
  };

  var i;
  for (var prefix in all) {
    if (all.hasOwnProperty(prefix)) {
      for (i = 0; i < all[prefix].length; i++) {
        ret[prefix + all[prefix][i]] = 1;
      }
    }
  }

  return ret;
})();
/**
 * Check if the timezone string is valid.
 * @param {string} timezone
 * @returns {boolean} If the timezone string is valid.
 */
fTimestamp.isValidTimezone = function (timezone) {
  return fTimestamp._validTimezones[timezone] !== undefined;
};
/**
 * Set the default timezone. Does nothing if the <code>timezone</code>
 *   parameter is invalid.
 * @param {string} timezone A timezone string, such as America/Chicago.
 */
fTimestamp.setDefaultTimezone = function (timezone) {
  if (!fTimestamp.isValidTimezone(timezone)) {
    return;
  }
  fTimestamp._defaultTimezone = timezone;
};
/**
 * Get the default time zone.
 * @returns {string} The time zone string.
 */
fTimestamp.getDefaultTimezone = function () {
  return fTimestamp._defaultTimezone || date_default_timezone_get();
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
