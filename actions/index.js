const ACTIONS = {
  USERS: {
    REGISTER: 'USER_REGISTER',
    GET: 'USER_GET'
  },
  EMAIL: {
    SEND: 'EMAIL_SEND'
  },
  KEYS: {
    GENERATE: 'KEYS_GENERATE',
    ENCRYPT: {
      ECDSA: 'KEYS_SIGN',
      ECDH: 'KEYS_ENCRYPT_ECDH'
    },
    DECRYPT: {
      ECDH: 'KEYS_DECRYPT_ECDH'
    }
  }
}

module.exports = ACTIONS
