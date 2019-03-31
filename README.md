## A very basic API for the bLoCkChAiN

### `GET` /getAllMessages/<`ACCOUNT_NAME`>
Returns the 100 most recent *sent* messages of `ACCOUNT_NAME`. Sorry, the sdk doens't work so hacky hacky hacky.

### `POST` /sendMessage
Body:
```json
{
    "sender": "SENDER_ACCOUNT_NAME",
    "recipient": "RECIPIENT_ACCOUNT_NAME",
    "message": "MESSAGE"
} 
```

Sends a message from sender to the recipient.

### `POST` /transfer
Body:
```json
{
    "payer": "PAYER_ACCOUNT_NAMER",
    "payee": "PAYEE_ACCOUNT_NAME",
    "amount": 1.23
} 
```

Transfers some amount of DCT from the payer to the payee.
