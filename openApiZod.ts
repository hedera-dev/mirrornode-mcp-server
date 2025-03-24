import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const EntityId = z.string();
const Alias = z.string();
const TimestampNullable = z.string();
const Balance = z
  .object({
    timestamp: TimestampNullable.regex(/^\d{1,10}(\.\d{1,9})?$/).nullable(),
    balance: z.number().int().nullable(),
    tokens: z.array(
      z
        .object({
          token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
          balance: z.number().int(),
        })
        .partial()
        .passthrough()
    ),
  })
  .passthrough();
const EvmAddressNullable = z.string();
const Key = z
  .object({
    _type: z.enum(["ECDSA_SECP256K1", "ED25519", "ProtobufEncoded"]),
    key: z.string(),
  })
  .partial()
  .passthrough();
const AccountInfo = z
  .object({
    account: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    alias: Alias.regex(
      /^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8})$/
    ).nullable(),
    auto_renew_period: z.number().int().nullable(),
    balance: Balance.nullable(),
    created_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    decline_reward: z.boolean(),
    deleted: z.boolean().nullable(),
    ethereum_nonce: z.number().int().nullable(),
    evm_address: EvmAddressNullable.min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/)
      .nullable(),
    expiry_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    key: Key.nullable(),
    max_automatic_token_associations: z.number().int().nullable(),
    memo: z.string().nullable(),
    pending_reward: z.number().int().optional(),
    receiver_sig_required: z.boolean().nullable(),
    staked_account_id: EntityId.and(z.unknown()),
    staked_node_id: z.number().int().nullable(),
    stake_period_start: TimestampNullable.and(z.unknown()),
  })
  .passthrough();
const Accounts = z.array(AccountInfo);
const Links = z.object({ next: z.string().nullable() }).partial().passthrough();
const AccountsResponse = z
  .object({ accounts: Accounts, links: Links })
  .passthrough();
const Error = z
  .object({
    _status: z
      .object({
        messages: z.array(
          z
            .object({
              data: z
                .string()
                .regex(/^0x[0-9a-fA-F]+$/)
                .nullable(),
              detail: z.string().nullable(),
              message: z.string(),
            })
            .partial()
            .passthrough()
        ),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const Timestamp = z.string();
const CustomFeeLimit = z
  .object({
    account_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    amount: z.number().int(),
    denominating_token_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
  })
  .partial()
  .passthrough();
const TransactionTypes = z.enum([
  "CONSENSUSCREATETOPIC",
  "CONSENSUSDELETETOPIC",
  "CONSENSUSSUBMITMESSAGE",
  "CONSENSUSUPDATETOPIC",
  "CONTRACTCALL",
  "CONTRACTCREATEINSTANCE",
  "CONTRACTDELETEINSTANCE",
  "CONTRACTUPDATEINSTANCE",
  "CRYPTOADDLIVEHASH",
  "CRYPTOAPPROVEALLOWANCE",
  "CRYPTOCREATEACCOUNT",
  "CRYPTODELETE",
  "CRYPTODELETEALLOWANCE",
  "CRYPTODELETELIVEHASH",
  "CRYPTOTRANSFER",
  "CRYPTOUPDATEACCOUNT",
  "ETHEREUMTRANSACTION",
  "FILEAPPEND",
  "FILECREATE",
  "FILEDELETE",
  "FILEUPDATE",
  "FREEZE",
  "NODE",
  "NODECREATE",
  "NODEDELETE",
  "NODESTAKEUPDATE",
  "NODEUPDATE",
  "SCHEDULECREATE",
  "SCHEDULEDELETE",
  "SCHEDULESIGN",
  "SYSTEMDELETE",
  "SYSTEMUNDELETE",
  "TOKENAIRDROP",
  "TOKENASSOCIATE",
  "TOKENBURN",
  "TOKENCANCELAIRDROP",
  "TOKENCLAIMAIRDROP",
  "TOKENCREATION",
  "TOKENDELETION",
  "TOKENDISSOCIATE",
  "TOKENFEESCHEDULEUPDATE",
  "TOKENFREEZE",
  "TOKENGRANTKYC",
  "TOKENMINT",
  "TOKENPAUSE",
  "TOKENREJECT",
  "TOKENREVOKEKYC",
  "TOKENUNFREEZE",
  "TOKENUNPAUSE",
  "TOKENUPDATE",
  "TOKENUPDATENFTS",
  "TOKENWIPE",
  "UNCHECKEDSUBMIT",
  "UNKNOWN",
  "UTILPRNG",
]);
const StakingRewardTransfer = z
  .object({
    account: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    amount: z.number().int(),
  })
  .passthrough();
const StakingRewardTransfers = z.array(StakingRewardTransfer);
const Transaction = z
  .object({
    bytes: z.string().nullable(),
    charged_tx_fee: z.number().int(),
    consensus_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    entity_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    max_custom_fees: z.array(CustomFeeLimit),
    max_fee: z.string(),
    memo_base64: z.string().nullable(),
    name: TransactionTypes,
    nft_transfers: z.array(
      z
        .object({
          is_approval: z.boolean(),
          receiver_account_id: EntityId.regex(
            /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
          ).nullable(),
          sender_account_id: EntityId.regex(
            /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
          ).nullable(),
          serial_number: z.number().int(),
          token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
        })
        .passthrough()
    ),
    node: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    nonce: z.number().int().gte(0),
    parent_consensus_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    result: z.string(),
    scheduled: z.boolean(),
    staking_reward_transfers: StakingRewardTransfers,
    token_transfers: z.array(
      z
        .object({
          token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
          account: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
          amount: z.number().int(),
          is_approval: z.boolean().optional(),
        })
        .passthrough()
    ),
    transaction_hash: z.string(),
    transaction_id: z.string(),
    transfers: z.array(
      z
        .object({
          account: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
          amount: z.number().int(),
          is_approval: z.boolean().optional(),
        })
        .passthrough()
    ),
    valid_duration_seconds: z.string(),
    valid_start_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
  })
  .partial()
  .passthrough();
const Transactions = z.array(Transaction);
const AccountBalanceTransactions = AccountInfo.and(
  z.object({ transactions: Transactions, links: Links }).passthrough()
);
const Nft = z
  .object({
    account_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    created_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    delegating_spender: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    deleted: z.boolean(),
    metadata: z.string(),
    modified_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    serial_number: z.number().int(),
    spender: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
  })
  .partial()
  .passthrough();
const Nfts = z
  .object({ nfts: z.array(Nft), links: Links })
  .partial()
  .passthrough();
const StakingReward = z
  .object({
    account_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    amount: z.number().int(),
    timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
  })
  .passthrough();
const StakingRewardsResponse = z
  .object({ rewards: z.array(StakingReward), links: Links })
  .partial()
  .passthrough();
const TokenRelationship = z
  .object({
    automatic_association: z.boolean(),
    balance: z.number().int(),
    created_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    decimals: z.number().int(),
    freeze_status: z.enum(["NOT_APPLICABLE", "FROZEN", "UNFROZEN"]),
    kyc_status: z.enum(["NOT_APPLICABLE", "GRANTED", "REVOKED"]),
    token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
  })
  .passthrough();
const TokenRelationshipResponse = z
  .object({ tokens: z.array(TokenRelationship), links: Links })
  .partial()
  .passthrough();
const TimestampRange = z
  .object({
    from: Timestamp.and(z.unknown()),
    to: TimestampNullable.and(z.unknown()),
  })
  .partial()
  .passthrough();
const TokenAirdrop = z
  .object({
    amount: z.number().int(),
    receiver_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    sender_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    serial_number: z.number().int().nullish(),
    timestamp: TimestampRange,
    token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
  })
  .passthrough();
const TokenAirdrops = z.array(TokenAirdrop);
const TokenAirdropsResponse = z
  .object({ airdrops: TokenAirdrops, links: Links })
  .partial()
  .passthrough();
const Allowance = z
  .object({
    amount: z.number().int(),
    amount_granted: z.number().int(),
    owner: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    spender: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    timestamp: TimestampRange,
  })
  .partial()
  .passthrough();
const CryptoAllowance = Allowance.and(
  z
    .object({ amount: z.number().int(), amount_granted: z.number().int() })
    .partial()
    .passthrough()
);
const CryptoAllowances = z.array(CryptoAllowance);
const CryptoAllowancesResponse = z
  .object({ allowances: CryptoAllowances, links: Links })
  .partial()
  .passthrough();
const TokenAllowance = Allowance.and(
  z
    .object({
      token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    })
    .partial()
    .passthrough()
);
const TokenAllowances = z.array(TokenAllowance);
const TokenAllowancesResponse = z
  .object({ allowances: TokenAllowances, links: Links })
  .partial()
  .passthrough();
const NftAllowance = z
  .object({
    approved_for_all: z.boolean(),
    owner: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    spender: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    timestamp: TimestampRange,
    token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
  })
  .passthrough();
const NftAllowances = z.array(NftAllowance);
const NftAllowancesResponse = z
  .object({ allowances: NftAllowances, links: Links })
  .partial()
  .passthrough();
const TokenBalance = z
  .object({
    token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    balance: z.number().int(),
  })
  .passthrough();
const AccountBalance = z
  .object({
    account: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    balance: z.number().int(),
    tokens: z.array(TokenBalance),
  })
  .passthrough();
const BalancesResponse = z
  .object({
    timestamp: TimestampNullable.regex(/^\d{1,10}(\.\d{1,9})?$/).nullable(),
    balances: z.array(AccountBalance),
    links: Links,
  })
  .partial()
  .passthrough();
const Block = z
  .object({
    count: z.number().int().gte(0),
    gas_used: z.number().int().gte(0).nullable(),
    hapi_version: z.string().nullable(),
    hash: z.string(),
    logs_bloom: z
      .string()
      .regex(/^0x[0-9a-fA-F]{512}$/)
      .nullable(),
    name: z.string(),
    number: z.number().int().gte(0),
    previous_hash: z.string(),
    size: z.number().int().nullable(),
    timestamp: TimestampRange,
  })
  .partial()
  .passthrough();
const Blocks = z.array(Block);
const BlocksResponse = z
  .object({ blocks: Blocks, links: Links })
  .partial()
  .passthrough();
const ContractCallRequest = z
  .object({
    block: z
      .string()
      .regex(/^((0x)?[0-9a-fA-F]+|(earliest|pending|latest))$/)
      .nullish(),
    data: z
      .string()
      .max(49154)
      .regex(/^(0x)?[0-9a-fA-F]+$/)
      .nullish(),
    estimate: z.boolean().nullish(),
    from: z
      .string()
      .min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/)
      .nullish(),
    gas: z.number().int().gte(0).nullish(),
    gasPrice: z.number().int().gte(0).nullish(),
    to: z
      .string()
      .min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/),
    value: z.number().int().gte(0).nullish(),
  })
  .passthrough();
const ContractCallResponse = z
  .object({ result: z.string().regex(/^0x[0-9a-fA-F]+$/) })
  .partial()
  .passthrough();
const EvmAddress = z.string();
const Contract = z
  .object({
    admin_key: Key.nullable(),
    auto_renew_account: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    auto_renew_period: z.number().int().nullable(),
    contract_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    created_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    deleted: z.boolean(),
    evm_address: EvmAddress.min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/),
    expiration_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    file_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    max_automatic_token_associations: z.number().int().nullable(),
    memo: z.string(),
    obtainer_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    permanent_removal: z.boolean().nullable(),
    proxy_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    timestamp: TimestampRange,
  })
  .partial()
  .passthrough();
const Contracts = z.array(Contract);
const ContractsResponse = z
  .object({ contracts: Contracts, links: Links })
  .partial()
  .passthrough();
const ContractResponse = Contract.and(
  z
    .object({
      bytecode: z.string().nullable(),
      runtime_bytecode: z.string().nullable(),
    })
    .partial()
    .passthrough()
);
const Bloom = z.string();
const ContractResult = z
  .object({
    access_list: z.string().nullable(),
    address: z.string(),
    amount: z.number().int().nullable(),
    block_gas_used: z.number().int().nullable(),
    block_hash: z.string().nullable(),
    block_number: z.number().int().nullable(),
    bloom: Bloom.and(z.unknown()),
    call_result: z.string().nullable(),
    chain_id: z.string().nullable(),
    contract_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    created_contract_ids: z.array(EntityId).nullable(),
    error_message: z.string().nullable(),
    failed_initcode: z.string(),
    from: EvmAddressNullable.min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/)
      .nullable(),
    function_parameters: z.string().nullable(),
    gas_consumed: z.number().int().nullable(),
    gas_limit: z.number().int(),
    gas_price: z.string().nullable(),
    gas_used: z.number().int().nullable(),
    hash: z.string(),
    max_fee_per_gas: z.string().nullable(),
    max_priority_fee_per_gas: z.string().nullable(),
    nonce: z.number().int().nullable(),
    r: z.string().nullable(),
    result: z.string(),
    s: z.string().nullable(),
    status: z.string(),
    timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    to: EvmAddressNullable.min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/)
      .nullable(),
    transaction_index: z.number().int().nullable(),
    type: z.number().int().nullable(),
    v: z.number().int().nullable(),
  })
  .partial()
  .passthrough();
const ContractResults = z.array(ContractResult);
const ContractResultsResponse = z
  .object({ results: ContractResults, links: Links })
  .partial()
  .passthrough();
const ContractState = z
  .object({
    address: EvmAddress.min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/),
    contract_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    slot: z.string(),
    value: z.string(),
  })
  .passthrough();
const ContractStateResponse = z
  .object({ state: z.array(ContractState), links: Links })
  .partial()
  .passthrough();
const ContractLogTopics = z.array(z.string());
const ContractResultLog = z
  .object({
    address: z.string().regex(/^0x[0-9A-Fa-f]{40}$/),
    bloom: Bloom.and(z.unknown()),
    contract_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    data: z.string().nullable(),
    index: z.number().int(),
    topics: ContractLogTopics,
  })
  .partial()
  .passthrough();
const ContractResultLogs = z.array(ContractResultLog);
const ContractResultStateChange = z
  .object({
    address: EvmAddress.min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/),
    contract_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    slot: z.string(),
    value_read: z.string(),
    value_written: z.string().nullable(),
  })
  .partial()
  .passthrough();
const ContractResultStateChanges = z.array(ContractResultStateChange);
const ContractResultDetails = ContractResult.and(
  z
    .object({
      access_list: z.string().nullable(),
      address: z.string(),
      block_gas_used: z.number().int().nullable(),
      block_hash: z.string().nullable(),
      block_number: z.number().int().nullable(),
      chain_id: z.string().nullable(),
      failed_initcode: z.string(),
      gas_price: z.string().nullable(),
      hash: z.string(),
      logs: ContractResultLogs,
      max_fee_per_gas: z.string().nullable(),
      max_priority_fee_per_gas: z.string().nullable(),
      nonce: z.number().int().nullable(),
      r: z.string().nullable(),
      s: z.string().nullable(),
      state_changes: ContractResultStateChanges,
      transaction_index: z.number().int().nullable(),
      type: z.number().int().nullable(),
      v: z.number().int().nullable(),
    })
    .partial()
    .passthrough()
);
const ContractAction = z
  .object({
    call_depth: z.number().int(),
    call_operation_type: z.enum([
      "CALL",
      "CALLCODE",
      "CREATE",
      "CREATE2",
      "DELEGATECALL",
      "STATICCALL",
      "UNKNOWN",
    ]),
    call_type: z.enum(["NO_ACTION", "CALL", "CREATE", "PRECOMPILE", "SYSTEM"]),
    caller: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    caller_type: z.enum(["ACCOUNT", "CONTRACT"]),
    from: z.string(),
    gas: z.number().int(),
    gas_used: z.number().int(),
    index: z.number().int(),
    input: z.string().nullable(),
    recipient: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    recipient_type: z.enum(["ACCOUNT", "CONTRACT"]).nullable(),
    result_data: z.string().nullable(),
    result_data_type: z.enum(["OUTPUT", "REVERT_REASON", "ERROR"]),
    timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    to: EvmAddressNullable.min(40)
      .max(42)
      .regex(/^(0x)?[A-Fa-f0-9]{40}$/)
      .nullable(),
    value: z.number().int(),
  })
  .partial()
  .passthrough();
const ContractActions = z.array(ContractAction);
const ContractActionsResponse = z
  .object({ actions: ContractActions, links: Links })
  .partial()
  .passthrough();
const Opcode = z
  .object({
    depth: z.number().int(),
    gas: z.number().int(),
    gas_cost: z.number().int(),
    memory: z.array(z.string()).nullable(),
    op: z.string(),
    pc: z.number().int(),
    reason: z.string().nullish(),
    stack: z.array(z.string()).nullable(),
    storage: z.record(z.string()).nullable(),
  })
  .passthrough();
const OpcodesResponse = z
  .object({
    address: z.string(),
    contract_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    failed: z.boolean(),
    gas: z.number().int(),
    opcodes: z.array(Opcode),
    return_value: z.string(),
  })
  .passthrough();
const ContractLog = ContractResultLog.and(
  z
    .object({
      block_hash: z.string(),
      block_number: z.number().int(),
      root_contract_id: EntityId.and(z.unknown()),
      timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
      transaction_hash: z.string(),
      transaction_index: z.number().int().nullable(),
    })
    .partial()
    .passthrough()
);
const ContractLogs = z.array(ContractLog);
const ContractLogsResponse = z
  .object({ logs: ContractLogs, links: Links })
  .partial()
  .passthrough();
const ExchangeRate = z
  .object({
    cent_equivalent: z.number().int(),
    expiration_time: z.number().int(),
    hbar_equivalent: z.number().int(),
  })
  .partial()
  .passthrough();
const NetworkExchangeRateSetResponse = z
  .object({
    current_rate: ExchangeRate,
    next_rate: ExchangeRate,
    timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
  })
  .partial()
  .passthrough();
const NetworkFee = z
  .object({ gas: z.number().int(), transaction_type: z.string() })
  .partial()
  .passthrough();
const NetworkFees = z.array(NetworkFee);
const NetworkFeesResponse = z
  .object({
    fees: NetworkFees,
    timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
  })
  .partial()
  .passthrough();
const ServiceEndpoint = z
  .object({
    domain_name: z.string(),
    ip_address_v4: z.string(),
    port: z.number().int(),
  })
  .passthrough();
const ServiceEndpoints = z.array(ServiceEndpoint);
const TimestampRangeNullable = z
  .object({
    from: Timestamp.and(z.unknown()),
    to: TimestampNullable.and(z.unknown()),
  })
  .partial()
  .passthrough();
const NetworkNode = z
  .object({
    admin_key: Key.nullable(),
    description: z.string().nullable(),
    file_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    max_stake: z.number().int().nullable(),
    memo: z.string().nullable(),
    min_stake: z.number().int().nullable(),
    node_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    node_id: z.number().int(),
    node_cert_hash: z.string().nullable(),
    public_key: z.string().nullable(),
    reward_rate_start: z.number().int().nullable(),
    service_endpoints: ServiceEndpoints,
    stake: z.number().int().nullable(),
    stake_not_rewarded: z.number().int().nullable(),
    stake_rewarded: z.number().int().nullable(),
    staking_period: TimestampRangeNullable.and(z.unknown()),
    timestamp: TimestampRange,
  })
  .passthrough();
const NetworkNodes = z.array(NetworkNode);
const NetworkNodesResponse = z
  .object({ nodes: NetworkNodes, links: Links })
  .passthrough();
const NetworkStakeResponse = z
  .object({
    max_stake_rewarded: z.number().int(),
    max_staking_reward_rate_per_hbar: z.number().int(),
    max_total_reward: z.number().int(),
    node_reward_fee_fraction: z.number(),
    reserved_staking_rewards: z.number().int(),
    reward_balance_threshold: z.number().int(),
    stake_total: z.number().int(),
    staking_period: TimestampRange.and(z.unknown()),
    staking_period_duration: z.number().int(),
    staking_periods_stored: z.number().int(),
    staking_reward_fee_fraction: z.number(),
    staking_reward_rate: z.number().int(),
    staking_start_threshold: z.number().int(),
    unreserved_staking_reward_balance: z.number().int(),
  })
  .passthrough();
const NetworkSupplyResponse = z
  .object({
    released_supply: z.string(),
    timestamp: Timestamp.and(z.unknown()),
    total_supply: z.string(),
  })
  .partial()
  .passthrough();
const ScheduleSignature = z
  .object({
    consensus_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    public_key_prefix: z.string(),
    signature: z.string(),
    type: z.enum([
      "CONTRACT",
      "ED25519",
      "RSA_3072",
      "ECDSA_384",
      "ECDSA_SECP256K1",
      "UNKNOWN",
    ]),
  })
  .partial()
  .passthrough();
const Schedule = z
  .object({
    admin_key: Key.nullable(),
    consensus_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    creator_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    deleted: z.boolean(),
    executed_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    expiration_time: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    memo: z.string(),
    payer_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    schedule_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    signatures: z.array(ScheduleSignature),
    transaction_body: z.string(),
    wait_for_expiry: z.boolean(),
  })
  .partial()
  .passthrough();
const Schedules = z.array(Schedule);
const SchedulesResponse = z
  .object({ schedules: Schedules, links: Links })
  .partial()
  .passthrough();
const TransactionsResponse = z
  .object({ transactions: Transactions, links: Links })
  .partial()
  .passthrough();
const AssessedCustomFee = z
  .object({
    amount: z.number().int(),
    collector_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    effective_payer_account_ids: z.array(EntityId),
    token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
  })
  .partial()
  .passthrough();
const TransactionDetail = Transaction.and(
  z
    .object({ assessed_custom_fees: z.array(AssessedCustomFee) })
    .partial()
    .passthrough()
);
const TransactionDetails = z.array(TransactionDetail);
const TransactionByIdResponse = z
  .object({ transactions: TransactionDetails })
  .partial()
  .passthrough();
const FixedCustomFee = z
  .object({
    amount: z.number().int(),
    collector_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    denominating_token_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
  })
  .partial()
  .passthrough();
const ConsensusCustomFees = z
  .object({
    created_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    fixed_fees: z.array(FixedCustomFee),
  })
  .partial()
  .passthrough();
const Topic = z
  .object({
    admin_key: Key.nullable(),
    auto_renew_account: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    auto_renew_period: z.number().int().nullable(),
    created_timestamp: TimestampNullable.regex(
      /^\d{1,10}(\.\d{1,9})?$/
    ).nullable(),
    custom_fees: ConsensusCustomFees,
    deleted: z.boolean().nullable(),
    fee_exempt_key_list: z.array(Key),
    fee_schedule_key: Key.nullable(),
    memo: z.string(),
    submit_key: Key.nullable(),
    timestamp: TimestampRange,
    topic_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
  })
  .passthrough();
const TransactionId = z
  .object({
    account_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    nonce: z.number().int().gte(0).nullable(),
    scheduled: z.boolean().nullable(),
    transaction_valid_start: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
  })
  .partial()
  .passthrough();
const ChunkInfo = z
  .object({
    initial_transaction_id: TransactionId,
    number: z.number().int(),
    total: z.number().int(),
  })
  .partial()
  .passthrough();
const TopicMessage = z
  .object({
    chunk_info: ChunkInfo.nullish(),
    consensus_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    message: z.string(),
    payer_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    running_hash: z.string(),
    running_hash_version: z.number().int(),
    sequence_number: z.number().int(),
    topic_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
  })
  .passthrough();
const TopicMessages = z.array(TopicMessage);
const TopicMessagesResponse = z
  .object({ messages: TopicMessages, links: Links })
  .partial()
  .passthrough();
const Token = z
  .object({
    admin_key: Key.nullable(),
    decimals: z.number().int(),
    metadata: z.string().optional(),
    name: z.string(),
    symbol: z.string(),
    token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    type: z.string(),
  })
  .passthrough();
const Tokens = z.array(Token);
const TokensResponse = z
  .object({ tokens: Tokens, links: Links })
  .partial()
  .passthrough();
const FixedFee = z
  .object({
    all_collectors_are_exempt: z.boolean(),
    amount: z.number().int(),
    collector_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    denominating_token_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
  })
  .partial()
  .passthrough();
const FractionalFee = z
  .object({
    all_collectors_are_exempt: z.boolean(),
    amount: z
      .object({ numerator: z.number().int(), denominator: z.number().int() })
      .partial()
      .passthrough(),
    collector_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    denominating_token_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    maximum: z.number().int().nullable(),
    minimum: z.number().int(),
    net_of_transfers: z.boolean(),
  })
  .partial()
  .passthrough();
const RoyaltyFee = z
  .object({
    all_collectors_are_exempt: z.boolean(),
    amount: z
      .object({ numerator: z.number().int(), denominator: z.number().int() })
      .partial()
      .passthrough(),
    collector_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    fallback_fee: z
      .object({
        amount: z.number().int(),
        denominating_token_id: EntityId.regex(
          /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
        ).nullable(),
      })
      .partial()
      .passthrough(),
  })
  .partial()
  .passthrough();
const CustomFees = z
  .object({
    created_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    fixed_fees: z.array(FixedFee),
    fractional_fees: z.array(FractionalFee),
    royalty_fees: z.array(RoyaltyFee),
  })
  .partial()
  .passthrough();
const TokenInfo = z
  .object({
    admin_key: Key.nullable(),
    auto_renew_account: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    auto_renew_period: z.number().int().nullable(),
    created_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    decimals: z.string(),
    deleted: z.boolean().nullable(),
    expiry_timestamp: z.number().int().nullable(),
    fee_schedule_key: Key.nullable(),
    freeze_default: z.boolean(),
    freeze_key: Key.nullable(),
    initial_supply: z.string(),
    kyc_key: Key.nullable(),
    max_supply: z.string(),
    metadata: z.string(),
    metadata_key: Key.and(z.unknown()),
    modified_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    name: z.string(),
    memo: z.string(),
    pause_key: Key.nullable(),
    pause_status: z.enum(["NOT_APPLICABLE", "PAUSED", "UNPAUSED"]),
    supply_key: Key.nullable(),
    supply_type: z.enum(["FINITE", "INFINITE"]),
    symbol: z.string(),
    token_id: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
    total_supply: z.string(),
    treasury_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    type: z.enum(["FUNGIBLE_COMMON", "NON_FUNGIBLE_UNIQUE"]),
    wipe_key: Key.nullable(),
    custom_fees: CustomFees,
  })
  .partial()
  .passthrough();
const TokenDistribution = z.array(
  z
    .object({
      account: EntityId.regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/).nullable(),
      balance: z.number().int(),
      decimals: z.number().int(),
    })
    .passthrough()
);
const TokenBalancesResponse = z
  .object({
    timestamp: TimestampNullable.regex(/^\d{1,10}(\.\d{1,9})?$/).nullable(),
    balances: TokenDistribution,
    links: Links,
  })
  .partial()
  .passthrough();
const NftTransactionTransfer = z
  .object({
    consensus_timestamp: Timestamp.regex(/^\d{1,10}(\.\d{1,9})?$/),
    is_approval: z.boolean(),
    nonce: z.number().int().gte(0),
    receiver_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    sender_account_id: EntityId.regex(
      /^\d{1,10}\.\d{1,10}\.\d{1,10}$/
    ).nullable(),
    transaction_id: z.string(),
    type: TransactionTypes,
  })
  .passthrough();
const NftTransactionHistory = z
  .object({ transactions: z.array(NftTransactionTransfer), links: Links })
  .passthrough();

export const schemas = {
  EntityId,
  Alias,
  TimestampNullable,
  Balance,
  EvmAddressNullable,
  Key,
  AccountInfo,
  Accounts,
  Links,
  AccountsResponse,
  Error,
  Timestamp,
  CustomFeeLimit,
  TransactionTypes,
  StakingRewardTransfer,
  StakingRewardTransfers,
  Transaction,
  Transactions,
  AccountBalanceTransactions,
  Nft,
  Nfts,
  StakingReward,
  StakingRewardsResponse,
  TokenRelationship,
  TokenRelationshipResponse,
  TimestampRange,
  TokenAirdrop,
  TokenAirdrops,
  TokenAirdropsResponse,
  Allowance,
  CryptoAllowance,
  CryptoAllowances,
  CryptoAllowancesResponse,
  TokenAllowance,
  TokenAllowances,
  TokenAllowancesResponse,
  NftAllowance,
  NftAllowances,
  NftAllowancesResponse,
  TokenBalance,
  AccountBalance,
  BalancesResponse,
  Block,
  Blocks,
  BlocksResponse,
  ContractCallRequest,
  ContractCallResponse,
  EvmAddress,
  Contract,
  Contracts,
  ContractsResponse,
  ContractResponse,
  Bloom,
  ContractResult,
  ContractResults,
  ContractResultsResponse,
  ContractState,
  ContractStateResponse,
  ContractLogTopics,
  ContractResultLog,
  ContractResultLogs,
  ContractResultStateChange,
  ContractResultStateChanges,
  ContractResultDetails,
  ContractAction,
  ContractActions,
  ContractActionsResponse,
  Opcode,
  OpcodesResponse,
  ContractLog,
  ContractLogs,
  ContractLogsResponse,
  ExchangeRate,
  NetworkExchangeRateSetResponse,
  NetworkFee,
  NetworkFees,
  NetworkFeesResponse,
  ServiceEndpoint,
  ServiceEndpoints,
  TimestampRangeNullable,
  NetworkNode,
  NetworkNodes,
  NetworkNodesResponse,
  NetworkStakeResponse,
  NetworkSupplyResponse,
  ScheduleSignature,
  Schedule,
  Schedules,
  SchedulesResponse,
  TransactionsResponse,
  AssessedCustomFee,
  TransactionDetail,
  TransactionDetails,
  TransactionByIdResponse,
  FixedCustomFee,
  ConsensusCustomFees,
  Topic,
  TransactionId,
  ChunkInfo,
  TopicMessage,
  TopicMessages,
  TopicMessagesResponse,
  Token,
  Tokens,
  TokensResponse,
  FixedFee,
  FractionalFee,
  RoyaltyFee,
  CustomFees,
  TokenInfo,
  TokenDistribution,
  TokenBalancesResponse,
  NftTransactionTransfer,
  NftTransactionHistory,
};

export const endpointDefinitions = [
  {
    method: "get",
    path: "/api/v1/accounts",
    alias: "getAccounts",
    description: `Returns a list of all account entity items on the network.`,
    requestFormat: "json",
    parameters: [
      {
        name: "account.balance",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "account.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "account.publickey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "balance",
        type: "Query",
        schema: z.boolean().optional().default(true),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
    ],
    response: AccountsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress",
    alias: "getAccount",
    description: `Return the account transactions and balance information given an account alias, an account id, or an evm address. The information will be limited to at most 1000 token balances for the account as outlined in HIP-367.
When the timestamp parameter is supplied, we will return transactions and account state for the relevant timestamp query. Balance information will be accurate to within 15 minutes of the provided timestamp query.
Historical ethereum nonce information is currently not available and may not be the exact value at a provided timestamp.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
      {
        name: "transactiontype",
        type: "Query",
        schema: z
          .enum([
            "CONSENSUSCREATETOPIC",
            "CONSENSUSDELETETOPIC",
            "CONSENSUSSUBMITMESSAGE",
            "CONSENSUSUPDATETOPIC",
            "CONTRACTCALL",
            "CONTRACTCREATEINSTANCE",
            "CONTRACTDELETEINSTANCE",
            "CONTRACTUPDATEINSTANCE",
            "CRYPTOADDLIVEHASH",
            "CRYPTOAPPROVEALLOWANCE",
            "CRYPTOCREATEACCOUNT",
            "CRYPTODELETE",
            "CRYPTODELETEALLOWANCE",
            "CRYPTODELETELIVEHASH",
            "CRYPTOTRANSFER",
            "CRYPTOUPDATEACCOUNT",
            "ETHEREUMTRANSACTION",
            "FILEAPPEND",
            "FILECREATE",
            "FILEDELETE",
            "FILEUPDATE",
            "FREEZE",
            "NODE",
            "NODECREATE",
            "NODEDELETE",
            "NODESTAKEUPDATE",
            "NODEUPDATE",
            "SCHEDULECREATE",
            "SCHEDULEDELETE",
            "SCHEDULESIGN",
            "SYSTEMDELETE",
            "SYSTEMUNDELETE",
            "TOKENAIRDROP",
            "TOKENASSOCIATE",
            "TOKENBURN",
            "TOKENCANCELAIRDROP",
            "TOKENCLAIMAIRDROP",
            "TOKENCREATION",
            "TOKENDELETION",
            "TOKENDISSOCIATE",
            "TOKENFEESCHEDULEUPDATE",
            "TOKENFREEZE",
            "TOKENGRANTKYC",
            "TOKENMINT",
            "TOKENPAUSE",
            "TOKENREJECT",
            "TOKENREVOKEKYC",
            "TOKENUNFREEZE",
            "TOKENUNPAUSE",
            "TOKENUPDATE",
            "TOKENUPDATENFTS",
            "TOKENWIPE",
            "UNCHECKEDSUBMIT",
            "UNKNOWN",
            "UTILPRNG",
          ])
          .optional(),
      },
      {
        name: "transactions",
        type: "Query",
        schema: z.boolean().optional().default(true),
      },
    ],
    response: AccountBalanceTransactions,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress/airdrops/outstanding",
    alias: "getOutstandingTokenAirdrops",
    description: `Returns outstanding token airdrops that have been sent by an account.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "receiver.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "serialnumber",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gt|gte|lt|lte):)?\d{1,19}?$/)
          .optional(),
      },
      {
        name: "token.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
    ],
    response: TokenAirdropsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress/airdrops/pending",
    alias: "getPendingTokenAirdrops",
    description: `Returns pending token airdrops that have been received by an account.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "sender.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "serialnumber",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gt|gte|lt|lte):)?\d{1,19}?$/)
          .optional(),
      },
      {
        name: "token.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
    ],
    response: TokenAirdropsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress/allowances/crypto",
    alias: "getCryptoAllowances",
    description: `Returns information for all crypto allowances for an account.`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "spender.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
    ],
    response: CryptoAllowancesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress/allowances/nfts",
    alias: "getNftAllowances",
    description: `Returns an account&#x27;s non-fungible token allowances.

## Ordering
The order is governed by a combination of the account ID and the token ID values, with account ID being the parent column.
The token ID value governs its order within the given account ID.

Note: The default order for this API is currently ascending. The account ID can be the owner or the spender ID depending upon the owner flag.

## Filtering
When filtering there are some restrictions enforced to ensure correctness and scalability.

**The table below defines the restrictions and support for the endpoint**

| Query Param   | Comparison Operator | Support | Description           | Example |
| ------------- | ------------------- | ------- | --------------------- | ------- |
| account.id    | eq                  | Y       | Single occurrence only. | ?account.id&#x3D;X |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. | ?account.id&#x3D;lte:X |
|               | gt(e)               | Y       | Single occurrence only. | ?account.id&#x3D;gte:X |
| token.id      | eq                  | Y       | Single occurrence only. Requires the presence of an **account.id** parameter | ?account.id&#x3D;X&amp;token.id&#x3D;eq:Y |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. Requires the presence of an **lte** or **eq** **account.id** parameter | ?account.id&#x3D;lte:X&amp;token.id&#x3D;lt:Y |
|               | gt(e)               | Y       | Single occurrence only. Requires the presence of an **gte** or **eq** **account.id** parameter | ?account.id&#x3D;gte:X&amp;token.id&#x3D;gt:Y |

Both filters must be a single occurrence of **gt(e)** or **lt(e)** which provide a lower and or upper boundary for search.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "account.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "token.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "owner",
        type: "Query",
        schema: z.boolean().optional().default(true),
      },
    ],
    response: NftAllowancesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress/allowances/tokens",
    alias: "getTokenAllowances",
    description: `Returns information for fungible token allowances for an account.

## Ordering
The order is governed by a combination of the spender id and the token id values, with spender id being the parent column.
The token id value governs its order within the given spender id.

Note: The default order for this API is currently ASC

## Filtering
When filtering there are some restrictions enforced to ensure correctness and scalability.

**The table below defines the restrictions and support for the endpoint**

| Query Param   | Comparison Operator | Support | Description           | Example |
| ------------- | ------------------- | ------- | --------------------- | ------- |
| spender.id    | eq                  | Y       | Single occurrence only. | ?spender.id&#x3D;X |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. | ?spender.id&#x3D;lte:X |
|               | gt(e)               | Y       | Single occurrence only. | ?spender.id&#x3D;gte:X |
| token.id      | eq                  | Y       | Single occurrence only. Requires the presence of a **spender.id** query | ?token.id&#x3D;lt:Y |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. Requires the presence of an **lte** or **eq** **spender.id** query | ?spender.id&#x3D;lte:X&amp;token.id&#x3D;lt:Y |
|               | gt(e)               | Y       | Single occurrence only. Requires the presence of an **gte** or **eq** **spender.id** query | ?spender.id&#x3D;gte:X&amp;token.id&#x3D;gt:Y |

Both filters must be a single occurrence of **gt(e)** or **lt(e)** which provide a lower and or upper boundary for search.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "spender.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "token.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
    ],
    response: TokenAllowancesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress/nfts",
    alias: "getNftsByAccountId",
    description: `Returns information for all non-fungible tokens for an account.

## Ordering
When considering NFTs, their order is governed by a combination of their numerical **token.Id** and **serialnumber** values, with **token.id** being the parent column.
A serialnumbers value governs its order within the given token.id

In that regard, if a user acquired a set of NFTs in the order (2-2, 2-4 1-5, 1-1, 1-3, 3-3, 3-4), the following layouts illustrate the ordering expectations for ownership listing
1. **All NFTs in ASC order**: 1-1, 1-3, 1-5, 2-2, 2-4, 3-3, 3-4
2. **All NFTs in DESC order**: 3-4, 3-3, 2-4, 2-2, 1-5, 1-3, 1-1
3. **NFTs above 1-1 in ASC order**: 1-3, 1-5, 2-2, 2-4, 3-3, 3-4
4. **NFTs below 3-3 in ASC order**: 1-1, 1-3, 1-5, 2-2, 2-4
5. **NFTs between 1-3 and 3-3 inclusive in DESC order**: 3-4, 3-3, 2-4, 2-2, 1-5, 1-3

Note: The default order for this API is currently DESC

## Filtering
When filtering there are some restrictions enforced to ensure correctness and scalability.

**The table below defines the restrictions and support for the NFT ownership endpoint**

| Query Param   | Comparison Operator | Support | Description           | Example |
| ------------- | ------------------- | ------- | --------------------- | ------- |
| token.id      | eq                  | Y       | Single occurrence only. | ?token.id&#x3D;X |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. | ?token.id&#x3D;lte:X |
|               | gt(e)               | Y       | Single occurrence only. | ?token.id&#x3D;gte:X |
| serialnumber  | eq                  | Y       | Single occurrence only. Requires the presence of a **token.id** query | ?serialnumber&#x3D;Y |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. Requires the presence of an **lte** or **eq** **token.id** query | ?token.id&#x3D;lte:X&amp;serialnumber&#x3D;lt:Y |
|               | gt(e)               | Y       | Single occurrence only. Requires the presence of an **gte** or **eq** **token.id** query | ?token.id&#x3D;gte:X&amp;serialnumber&#x3D;gt:Y |
| spender.id    | eq                  | Y       | | ?spender.id&#x3D;Z |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | | ?spender.id&#x3D;lt:Z |
|               | gt(e)               | Y       | | ?spender.id&#x3D;gt:Z |

Note: When searching across a range for individual NFTs a **serialnumber** with an additional **token.id** query filter must be provided.
Both filters must be a single occurrence of **gt(e)** or **lt(e)** which provide a lower and or upper boundary for search.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "serialnumber",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gt|gte|lt|lte):)?\d{1,19}?$/)
          .optional(),
      },
      {
        name: "spender.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "token.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
    ],
    response: Nfts,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress/rewards",
    alias: "getStakingRewards",
    description: `Returns information for all past staking reward payouts for an account.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: StakingRewardsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/accounts/:idOrAliasOrEvmAddress/tokens",
    alias: "getTokensByAccountId",
    description: `Returns information for all token relationships for an account.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "idOrAliasOrEvmAddress",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          ),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "token.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
    ],
    response: TokenRelationshipResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/balances",
    alias: "getBalances",
    description: `Returns a list of account and token balances on the network. Balance information returned by this API has a 15 minute granularity as it&#x27;s generated by an asynchronous balance snapshot process. This information is limited to at most 50 token balances per account as outlined in HIP-367. As such, it&#x27;s not recommended for general use and we instead recommend using either &#x60;/api/v1/accounts/{id}/tokens&#x60; or &#x60;/api/v1/tokens/{id}/balances&#x60; to obtain the current token balance information and &#x60;/api/v1/accounts/{id}&#x60; to return the current account balance.`,
    requestFormat: "json",
    parameters: [
      {
        name: "account.id",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40}|(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}|[A-Z2-7]{4,5}|[A-Z2-7]{7,8}))$/
          )
          .optional(),
      },
      {
        name: "account.balance",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "account.publickey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: BalancesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/blocks",
    alias: "getBlocks",
    description: `Returns a list of blocks on the network.`,
    requestFormat: "json",
    parameters: [
      {
        name: "block.number",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gt|gte|lt|lte):)?\d{1,19}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: BlocksResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/blocks/:hashOrNumber",
    alias: "getBlock",
    description: `Returns the block information by given hash or number.`,
    requestFormat: "json",
    parameters: [
      {
        name: "hashOrNumber",
        type: "Path",
        schema: z
          .string()
          .regex(/^(\d{1,10}|(0x)?([A-Fa-f0-9]{64}|[A-Fa-f0-9]{96}))$/),
      },
    ],
    response: Block,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts",
    alias: "getContracts",
    description: `Returns a list of all contract entity items on the network.`,
    requestFormat: "json",
    parameters: [
      {
        name: "contract.id",
        type: "Query",
        schema: z
          .string()
          .regex(
            /^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}|(\d{1,10}\.){0,2}[A-Fa-f0-9]{40}$/
          )
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
    ],
    response: ContractsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/:contractIdOrAddress",
    alias: "getContract",
    description: `Return the contract information given an id`,
    requestFormat: "json",
    parameters: [
      {
        name: "contractIdOrAddress",
        type: "Path",
        schema: z
          .string()
          .regex(/^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40})$/),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: ContractResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/:contractIdOrAddress/results",
    alias: "getContractResultsByContractId",
    description: `Returns a list of all ContractResults for a contract&#x27;s function executions.`,
    requestFormat: "json",
    parameters: [
      {
        name: "contractIdOrAddress",
        type: "Path",
        schema: z
          .string()
          .regex(/^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40})$/),
      },
      {
        name: "block.hash",
        type: "Query",
        schema: z
          .string()
          .regex(/^(eq:)?(0x)?([0-9A-Fa-f]{64}|[0-9A-Fa-f]{96})$/)
          .optional(),
      },
      {
        name: "block.number",
        type: "Query",
        schema: z
          .string()
          .regex(/^(eq:)?(\d{1,19}|0x[a-fA-f0-9]+)$/)
          .optional(),
      },
      {
        name: "from",
        type: "Query",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}|(0x)?[A-Fa-f0-9]{40}$/)
          .optional(),
      },
      {
        name: "internal",
        type: "Query",
        schema: z.boolean().optional().default(false),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
      {
        name: "transaction.index",
        type: "Query",
        schema: z.number().int().gte(0).optional(),
      },
    ],
    response: ContractResultsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/:contractIdOrAddress/results/:timestamp",
    alias: "getContractResultByIdAndTimestamp",
    description: `Returns a single ContractResult for a contract&#x27;s function executions at a specific timestamp.`,
    requestFormat: "json",
    parameters: [
      {
        name: "contractIdOrAddress",
        type: "Path",
        schema: z
          .string()
          .regex(/^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40})$/),
      },
      {
        name: "timestamp",
        type: "Path",
        schema: z.string().regex(/^\d{1,10}(.\d{1,9})?$/),
      },
    ],
    response: ContractResultDetails,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/:contractIdOrAddress/results/logs",
    alias: "getContractLogsByContractId",
    description: `Search the logs of a specific contract across multiple contract calls. Chained logs are not
included but can be found by calling &#x60;/api/v1/contracts/{contractId}/results/{timestamp}&#x60;
or &#x60;/api/v1/contracts/results/{transactionId}&#x60;. When searching by topic a timestamp parameter must be supplied
and span a time range of at most seven days.

## Ordering
The order is governed by the combination of timestamp and index values. If the index param is omitted, the order is determined by the timestamp only.

Note: The default order for this API is currently DESC

## Filtering
When filtering there are some restrictions enforced to ensure correctness and scalability.

**The table below defines the restrictions and support for the endpoint**

| Query Param   | Comparison Operator | Support | Description           | Example |
| ------------- | ------------------- | ------- | --------------------- | ------- |
| index         | eq                  | Y       | Single occurrence only. Requires the presence of timestamp | ?index&#x3D;X |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. Requires the presence of timestamp | ?index&#x3D;lte:X |
|               | gt(e)               | Y       | Single occurrence only. Requires the presence of timestamp | ?index&#x3D;gte:X |
| timestamp     | eq                  | Y       | Single occurrence only. | ?timestamp&#x3D;Y
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. Optional second timestamp **gt(e)** | ?timestamp&#x3D;lte:Y
|               | gt(e)               | Y       | Single occurrence only. Optional second timestamp **lt(e)** | ?timestamp&#x3D;gte:Y


Both filters must be a single occurrence of **gt(e)** or **lt(e)** which provide a lower and or upper boundary for search.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "contractIdOrAddress",
        type: "Path",
        schema: z
          .string()
          .regex(/^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40})$/),
      },
      {
        name: "index",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gt|gte|lt|lte):)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
      {
        name: "topic0",
        type: "Query",
        schema: z
          .array(z.string().regex(/^(0x)?[0-9A-Fa-f]{1,64}$/))
          .optional(),
      },
      {
        name: "topic1",
        type: "Query",
        schema: z
          .array(z.string().regex(/^(0x)?[0-9A-Fa-f]{1,64}$/))
          .optional(),
      },
      {
        name: "topic2",
        type: "Query",
        schema: z
          .array(z.string().regex(/^(0x)?[0-9A-Fa-f]{1,64}$/))
          .optional(),
      },
      {
        name: "topic3",
        type: "Query",
        schema: z
          .array(z.string().regex(/^(0x)?[0-9A-Fa-f]{1,64}$/))
          .optional(),
      },
    ],
    response: ContractLogsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/:contractIdOrAddress/state",
    alias: "getContractState",
    description: `Returns a list of all contract&#x27;s slots. If no timestamp is provided, returns the current state.`,
    requestFormat: "json",
    parameters: [
      {
        name: "contractIdOrAddress",
        type: "Path",
        schema: z
          .string()
          .regex(/^(\d{1,10}\.){0,2}(\d{1,10}|(0x)?[A-Fa-f0-9]{40})$/),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "slot",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gte?|lte?)\:)?(0x)?[0-9A-Fa-f]{1,64}$/)
          .optional(),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: ContractStateResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/contracts/call",
    alias: "contractCall",
    description: `Returns a result from EVM execution such as cost-free execution of read-only smart contract queries, gas estimation, and transient simulation of read-write operations. If the &#x60;estimate&#x60; field is set to true gas estimation is executed. However, gas estimation only supports the &#x60;latest&#x60; block. When &#x60;estimate&#x60; is false, it can process calls against the &#x60;earliest&#x60; block and specific historical blocks when a hexadecimal or decimal block number is provided in the &#x60;block&#x60; field for &#x60;eth_call&#x60; operations. [Link to Supported/Unsupported Operations Table](https://github.com/hiero-ledger/hiero-mirror-node/blob/main/docs/web3/README.md#supported/unsupported-operations)
The operations types which are not currently supported should return 501 error status.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ContractCallRequest,
      },
    ],
    response: z
      .object({ result: z.string().regex(/^0x[0-9a-fA-F]+$/) })
      .partial()
      .passthrough(),
    errors: [
      {
        status: 400,
        description: `Validation error`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not found error`,
        schema: Error,
      },
      {
        status: 415,
        description: `Unsupported media type error`,
        schema: Error,
      },
      {
        status: 429,
        description: `Too many requests`,
        schema: Error,
      },
      {
        status: 500,
        description: `Generic error`,
        schema: Error,
      },
      {
        status: 501,
        description: `Not implemented error`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/results",
    alias: "getContractsResults",
    description: `Returns a list of all ContractResults for all contract&#x27;s function executions.`,
    requestFormat: "json",
    parameters: [
      {
        name: "from",
        type: "Query",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}|(0x)?[A-Fa-f0-9]{40}$/)
          .optional(),
      },
      {
        name: "block.hash",
        type: "Query",
        schema: z
          .string()
          .regex(/^(eq:)?(0x)?([0-9A-Fa-f]{64}|[0-9A-Fa-f]{96})$/)
          .optional(),
      },
      {
        name: "block.number",
        type: "Query",
        schema: z
          .string()
          .regex(/^(eq:)?(\d{1,19}|0x[a-fA-f0-9]+)$/)
          .optional(),
      },
      {
        name: "internal",
        type: "Query",
        schema: z.boolean().optional().default(false),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
      {
        name: "transaction.index",
        type: "Query",
        schema: z.number().int().gte(0).optional(),
      },
    ],
    response: ContractResultsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/results/:transactionIdOrHash",
    alias: "getContractResultByTransactionIdOrHash",
    description: `Returns a single ContractResult for a contract&#x27;s function executions for a given transactionId or ethereum transaction hash.`,
    requestFormat: "json",
    parameters: [
      {
        name: "transactionIdOrHash",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(0x)?[A-Fa-f0-9]{64}|(\d{1,10})\.(\d{1,10})\.(\d{1,10})-(\d{1,19})-(\d{1,9})$/
          ),
      },
      {
        name: "nonce",
        type: "Query",
        schema: z.number().int().gte(0).optional().default(0),
      },
    ],
    response: ContractResultDetails,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/results/:transactionIdOrHash/actions",
    alias: "getContractActions",
    description: `Returns a list of ContractActions for a contract&#x27;s function executions for a given transactionId or ethereum transaction hash.`,
    requestFormat: "json",
    parameters: [
      {
        name: "transactionIdOrHash",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(0x)?[A-Fa-f0-9]{64}|(\d{1,10})\.(\d{1,10})\.(\d{1,10})-(\d{1,19})-(\d{1,9})$/
          ),
      },
      {
        name: "index",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
    ],
    response: ContractActionsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/results/:transactionIdOrHash/opcodes",
    alias: "getContractOpcodes",
    description: `Re-executes a transaction and returns a result containing detailed information for the execution,
including all values from the {@code stack}, {@code memory} and {@code storage}
and the entire trace of opcodes that were executed during the replay.

Note that to provide the output, the transaction needs to be re-executed on the EVM,
which may take a significant amount of time to complete if stack and memory information is requested.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "transactionIdOrHash",
        type: "Path",
        schema: z
          .string()
          .regex(
            /^(0x)?[A-Fa-f0-9]{64}|(\d{1,10})\.(\d{1,10})\.(\d{1,10})-(\d{1,19})-(\d{1,9})$/
          ),
      },
      {
        name: "stack",
        type: "Query",
        schema: z.boolean().optional().default(true),
      },
      {
        name: "memory",
        type: "Query",
        schema: z.boolean().optional().default(false),
      },
      {
        name: "storage",
        type: "Query",
        schema: z.boolean().optional().default(false),
      },
    ],
    response: OpcodesResponse,
    errors: [
      {
        status: 400,
        description: `Validation error`,
        schema: Error,
      },
      {
        status: 404,
        description: `Transaction or record file not found`,
        schema: Error,
      },
      {
        status: 429,
        description: `Too many requests`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/contracts/results/logs",
    alias: "getContractsLogs",
    description: `Search the logs across many contracts with multiple contract calls. Chained logs are not
included but can be found by calling &#x60;/api/v1/contracts/{contractId}/results/{timestamp}&#x60;
or &#x60;/api/v1/contracts/results/{transactionId}&#x60;. When searching by topic a timestamp parameter must be supplied
and span a time range of at most seven days.

## Ordering
The order is governed by the combination of timestamp and index values. If the index param is omitted, the order is determined by the timestamp only.

Note: The default order for this API is currently DESC

## Filtering
When filtering there are some restrictions enforced to ensure correctness and scalability.

**The table below defines the restrictions and support for the endpoint**

| Query Param   | Comparison Operator | Support | Description           | Example |
| ------------- | ------------------- | ------- | --------------------- | ------- |
| index         | eq                  | Y       | Single occurrence only. Requires the presence of timestamp | ?index&#x3D;X |
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. Requires the presence of timestamp | ?index&#x3D;lte:X |
|               | gt(e)               | Y       | Single occurrence only. Requires the presence of timestamp | ?index&#x3D;gte:X |
| timestamp     | eq                  | Y       | Single occurrence only. | ?timestamp&#x3D;Y
|               | ne                  | N       | | |
|               | lt(e)               | Y       | Single occurrence only. Optional second timestamp **gt(e)** | ?timestamp&#x3D;lte:Y
|               | gt(e)               | Y       | Single occurrence only. Optional second timestamp **lt(e)** | ?timestamp&#x3D;gte:Y


Both filters must be a single occurrence of **gt(e)** or **lt(e)** which provide a lower and or upper boundary for search.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "index",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gt|gte|lt|lte):)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
      {
        name: "topic0",
        type: "Query",
        schema: z
          .array(z.string().regex(/^(0x)?[0-9A-Fa-f]{1,64}$/))
          .optional(),
      },
      {
        name: "topic1",
        type: "Query",
        schema: z
          .array(z.string().regex(/^(0x)?[0-9A-Fa-f]{1,64}$/))
          .optional(),
      },
      {
        name: "topic2",
        type: "Query",
        schema: z
          .array(z.string().regex(/^(0x)?[0-9A-Fa-f]{1,64}$/))
          .optional(),
      },
      {
        name: "topic3",
        type: "Query",
        schema: z
          .array(z.string().regex(/^(0x)?[0-9A-Fa-f]{1,64}$/))
          .optional(),
      },
      {
        name: "transaction.hash",
        type: "Query",
        schema: z
          .string()
          .regex(/^(eq:)?(0x)?([0-9A-Fa-f]{64}|[0-9A-Fa-f]{96})$/)
          .optional(),
      },
    ],
    response: ContractLogsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/network/exchangerate",
    alias: "getNetworkExchangeRate",
    description: `Returns the network&#x27;s exchange rate, current and next.`,
    requestFormat: "json",
    parameters: [
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: NetworkExchangeRateSetResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
      {
        status: 500,
        description: `Service Unavailable`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/network/fees",
    alias: "getNetworkFees",
    description: `Returns the estimated gas in tinybars per each transaction type. Default order is ASC. Currently only &#x60;ContractCall&#x60;, &#x60;ContractCreate&#x60; and &#x60;EthereumTransaction&#x60; transaction types are supported.`,
    requestFormat: "json",
    parameters: [
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: NetworkFeesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
      {
        status: 500,
        description: `Service Unavailable`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/network/nodes",
    alias: "getNetworkNodes",
    description: `Returns the network&#x27;s list of nodes used in consensus`,
    requestFormat: "json",
    parameters: [
      {
        name: "file.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "node.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gt|gte|lt|lte):)?\d{1,19}$/)
          .optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
    ],
    response: NetworkNodesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/network/stake",
    alias: "getNetworkStake",
    description: `Returns the network&#x27;s current stake information.`,
    requestFormat: "json",
    response: NetworkStakeResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
      {
        status: 500,
        description: `Service Unavailable`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/network/supply",
    alias: "getNetworkSupply",
    description: `Returns the network&#x27;s released supply of hbars`,
    requestFormat: "json",
    parameters: [
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: NetworkSupplyResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/schedules",
    alias: "getSchedules",
    description: `Lists schedules on the network that govern the execution logic of scheduled transactions. This includes executed and non executed schedules.`,
    requestFormat: "json",
    parameters: [
      {
        name: "account.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "schedule.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
    ],
    response: SchedulesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/schedules/:scheduleId",
    alias: "getSchedule",
    description: `Returns schedule information based on the given schedule id`,
    requestFormat: "json",
    parameters: [
      {
        name: "scheduleId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
    ],
    response: Schedule,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/tokens",
    alias: "getTokens",
    description: `Returns a list of tokens on the network.`,
    requestFormat: "json",
    parameters: [
      {
        name: "account.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "name",
        type: "Query",
        schema: z.string().min(3).max(100).optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "publickey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "token.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "type",
        type: "Query",
        schema: z.array(z.string()).optional(),
      },
    ],
    response: TokensResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/tokens/:tokenId",
    alias: "getToken",
    description: `Returns token entity information given the id`,
    requestFormat: "json",
    parameters: [
      {
        name: "tokenId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|lt|lte):)?\d{1,10}(.\d{1,9})?$/)
          .optional(),
      },
    ],
    response: TokenInfo,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/tokens/:tokenId/balances",
    alias: "getTokenBalances",
    description: `Returns a list of token balances given the id. This represents the Token supply distribution across the network`,
    requestFormat: "json",
    parameters: [
      {
        name: "tokenId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
      {
        name: "account.balance",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "account.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "account.publickey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: TokenBalancesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/tokens/:tokenId/nfts",
    alias: "getNfts",
    description: `Returns a list of non-fungible tokens`,
    requestFormat: "json",
    parameters: [
      {
        name: "tokenId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
      {
        name: "account.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "serialnumber",
        type: "Query",
        schema: z
          .string()
          .regex(/^((eq|gt|gte|lt|lte):)?\d{1,19}?$/)
          .optional(),
      },
    ],
    response: Nfts,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/tokens/:tokenId/nfts/:serialNumber",
    alias: "getNft",
    description: `Returns information for a non-fungible token`,
    requestFormat: "json",
    parameters: [
      {
        name: "tokenId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
      {
        name: "serialNumber",
        type: "Path",
        schema: z.number().int().gte(1).lte(9223372036854776000).default(1),
      },
    ],
    response: Nft,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/tokens/:tokenId/nfts/:serialNumber/transactions",
    alias: "getNftTransactions",
    description: `Returns a list of transactions for a given non-fungible token`,
    requestFormat: "json",
    parameters: [
      {
        name: "tokenId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
      {
        name: "serialNumber",
        type: "Path",
        schema: z.number().int().gte(1).lte(9223372036854776000).default(1),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: NftTransactionHistory,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/topics/:topicId",
    alias: "getTopic",
    description: `Returns the topic details for the given topic ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "topicId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
    ],
    response: Topic,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/topics/:topicId/messages",
    alias: "getTopicMessages",
    description: `Returns the list of topic messages for the given topic id.`,
    requestFormat: "json",
    parameters: [
      {
        name: "topicId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
      {
        name: "encoding",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("asc"),
      },
      {
        name: "sequencenumber",
        type: "Query",
        schema: z.number().int().gte(0).optional(),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
    ],
    response: TopicMessagesResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Topic Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/topics/:topicId/messages/:sequenceNumber",
    alias: "getTopicMessageByIdAndSequenceNumber",
    description: `Returns a single topic message for the given topic id and sequence number.`,
    requestFormat: "json",
    parameters: [
      {
        name: "topicId",
        type: "Path",
        schema: z
          .string()
          .regex(/^\d{1,10}\.\d{1,10}\.\d{1,10}$/)
          .nullable(),
      },
      {
        name: "sequenceNumber",
        type: "Path",
        schema: z.number().int().gte(0),
      },
    ],
    response: TopicMessage,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/topics/messages/:timestamp",
    alias: "getTopicMessageByTimestamp",
    description: `Returns a topic message the given the consensusTimestamp.`,
    requestFormat: "json",
    parameters: [
      {
        name: "timestamp",
        type: "Path",
        schema: z.string().regex(/^\d{1,10}(.\d{1,9})?$/),
      },
    ],
    response: TopicMessage,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/transactions",
    alias: "getTransactions",
    description: `Lists transactions on the network. This includes successful and unsuccessful transactions.`,
    requestFormat: "json",
    parameters: [
      {
        name: "account.id",
        type: "Query",
        schema: z
          .string()
          .regex(/^((gte?|lte?|eq|ne)\:)?(\d{1,10}\.\d{1,10}\.)?\d{1,10}$/)
          .optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(25),
      },
      {
        name: "order",
        type: "Query",
        schema: z.unknown().optional().default("desc"),
      },
      {
        name: "timestamp",
        type: "Query",
        schema: z
          .array(
            z.string().regex(/^((eq|gt|gte|lt|lte|ne):)?\d{1,10}(.\d{1,9})?$/)
          )
          .optional(),
      },
      {
        name: "transactiontype",
        type: "Query",
        schema: z
          .enum([
            "CONSENSUSCREATETOPIC",
            "CONSENSUSDELETETOPIC",
            "CONSENSUSSUBMITMESSAGE",
            "CONSENSUSUPDATETOPIC",
            "CONTRACTCALL",
            "CONTRACTCREATEINSTANCE",
            "CONTRACTDELETEINSTANCE",
            "CONTRACTUPDATEINSTANCE",
            "CRYPTOADDLIVEHASH",
            "CRYPTOAPPROVEALLOWANCE",
            "CRYPTOCREATEACCOUNT",
            "CRYPTODELETE",
            "CRYPTODELETEALLOWANCE",
            "CRYPTODELETELIVEHASH",
            "CRYPTOTRANSFER",
            "CRYPTOUPDATEACCOUNT",
            "ETHEREUMTRANSACTION",
            "FILEAPPEND",
            "FILECREATE",
            "FILEDELETE",
            "FILEUPDATE",
            "FREEZE",
            "NODE",
            "NODECREATE",
            "NODEDELETE",
            "NODESTAKEUPDATE",
            "NODEUPDATE",
            "SCHEDULECREATE",
            "SCHEDULEDELETE",
            "SCHEDULESIGN",
            "SYSTEMDELETE",
            "SYSTEMUNDELETE",
            "TOKENAIRDROP",
            "TOKENASSOCIATE",
            "TOKENBURN",
            "TOKENCANCELAIRDROP",
            "TOKENCLAIMAIRDROP",
            "TOKENCREATION",
            "TOKENDELETION",
            "TOKENDISSOCIATE",
            "TOKENFEESCHEDULEUPDATE",
            "TOKENFREEZE",
            "TOKENGRANTKYC",
            "TOKENMINT",
            "TOKENPAUSE",
            "TOKENREJECT",
            "TOKENREVOKEKYC",
            "TOKENUNFREEZE",
            "TOKENUNPAUSE",
            "TOKENUPDATE",
            "TOKENUPDATENFTS",
            "TOKENWIPE",
            "UNCHECKEDSUBMIT",
            "UNKNOWN",
            "UTILPRNG",
          ])
          .optional(),
      },
      {
        name: "result",
        type: "Query",
        schema: z.unknown().optional(),
      },
      {
        name: "type",
        type: "Query",
        schema: z.unknown().optional(),
      },
    ],
    response: TransactionsResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/transactions/:transactionId",
    alias: "getTransaction",
    description: `Returns transaction information based on the given transaction id`,
    requestFormat: "json",
    parameters: [
      {
        name: "transactionId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "nonce",
        type: "Query",
        schema: z.number().int().gte(0).optional(),
      },
      {
        name: "scheduled",
        type: "Query",
        schema: z.boolean().optional(),
      },
    ],
    response: TransactionByIdResponse,
    errors: [
      {
        status: 400,
        description: `Invalid parameter`,
        schema: Error,
      },
      {
        status: 404,
        description: `Not Found`,
        schema: Error,
      },
    ],
  },
];

const endpoints = makeApi(endpointDefinitions);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
