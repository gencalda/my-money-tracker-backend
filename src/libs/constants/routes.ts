enum ROUTES {
  TRANSACTIONS = '/api/transactions',
  TRANSACTIONS_ID = '/api/transactions/:transactionId',
  TRANSACTION_SOURCES = '/api/transaction-sources',
  ATTACHMENTS = '/api/attachments/:attachmentType',
  ATTACHMENTS_EVENT = '/api/attachments/{attachmentType}',
}

export default ROUTES;
