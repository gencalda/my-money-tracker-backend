enum ROUTES {
  TRANSACTIONS = '/transactions',
  TRANSACTIONS_ID = '/transactions/:transactionId',
  TRANSACTION_SOURCES = '/transaction-sources',
  ATTACHMENTS = '/attachments/:attachmentType',
  ATTACHMENTS_EVENT = '/attachments/{attachmentType}',
}

export default ROUTES;
