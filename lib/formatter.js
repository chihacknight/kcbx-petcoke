module.exports = {

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
    phone = normalizePhone(phone)
    if (!phone)
      return "";

    var ac   = phone.substr(0, 3);
    var exch = phone.substr(3, 3);
    var rem  = phone.substr(6);

    return "(" + ac + ") " + exch + "-" + rem;
  }


}
