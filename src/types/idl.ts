export type IDLType = {
  "version": "0.1.0",
  "name": "soltrek_program",
  "instructions": [
    {
      "name": "createUser",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createPlayground",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playgroundAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playgroundNumber",
          "type": "string"
        },
        {
          "name": "dataUri",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "User",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playgroundCount",
            "type": "u128"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "Playground",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dataUri",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "number",
            "type": "string"
          }
        ]
      }
    }
  ],
  "metadata": {
    "address": "GESymwz7zdZ7uu7QYkpxNEtgEmDhZUQntgMYbZueD5te"
  }
}
export const IDLData: IDLType = {
  "version": "0.1.0",
  "name": "soltrek_program",
  "instructions": [
    {
      "name": "createUser",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createPlayground",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playgroundAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playgroundNumber",
          "type": "string"
        },
        {
          "name": "dataUri",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "User",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playgroundCount",
            "type": "u128"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "Playground",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dataUri",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "number",
            "type": "string"
          }
        ]
      }
    }
  ],
  "metadata": {
    "address": "GESymwz7zdZ7uu7QYkpxNEtgEmDhZUQntgMYbZueD5te"
  }
}