module.exports = {


  /**
   * Translates compass bearing ie 270
   * to cardinal direction ie West
   */
  degreeToCompass: function(deg, abbr) {
    if (arguments.length === 2)
      abbr = false;

    if (337.5 <= deg || deg < 22.5)
      return abbr ? "N" : "North";

    if ( 22.5 <= deg && deg < 67.5 )
      return abbr ? "NE" : "Northeast";

    if ( 67.5 <= deg && deg < 112.5 )
      return abbr ? "E" : "East";

    if ( 112.5 <= deg && deg < 157.5 )
      return abbr ? "SE" : "Southeast";

    if ( 157.5 <= deg && deg < 202.5 )
      return abbr ? "S" : "South";

    if ( 202.5 <= deg && deg < 247.5 )
      return abbr ? "SW" : "Southwest";

    if ( 247.5 <= deg && deg < 292.5 )
      return abbr ? "W" : "West";

    if ( 292.5 <= deg && deg < 337.5 )
      return abbr ? "NW" : "Northwest";
  },

  /**
   * Normalizes phone number to digits only.
   * 
   * Returns 10 digit string or empty string if phone number is malformed
   */
  normalizePhone: function(phone) {
    phone = phone || "";
    phone = phone.replace(/[^\d]/g, '');

    if (phone[0] === '1')
      phone = phone.substring(1);

    if (phone.length != 10)
      return '';

    return phone;
  },


  /**
   * Formats phone number to form (XXX) XXX-XXXX
   * Returns empty string if phone number is malformed
   */
  formatPhone: function(phone) {
    phone = this.normalizePhone(phone)
    if (!phone)
      return "";

    var ac   = phone.substr(0, 3);
    var exch = phone.substr(3, 3);
    var rem  = phone.substr(6);

    return "(" + ac + ") " + exch + "-" + rem;
  }


}
