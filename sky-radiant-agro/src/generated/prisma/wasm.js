
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CommodityScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  category: 'category',
  defaultShelfLifeDays: 'defaultShelfLifeDays',
  createdAt: 'createdAt'
};

exports.Prisma.MarketScalarFieldEnum = {
  id: 'id',
  name: 'name',
  region: 'region',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.MandiPriceScalarFieldEnum = {
  id: 'id',
  commodityId: 'commodityId',
  marketId: 'marketId',
  priceMin: 'priceMin',
  priceMax: 'priceMax',
  priceModal: 'priceModal',
  observedAt: 'observedAt',
  source: 'source',
  createdAt: 'createdAt'
};

exports.Prisma.RecommendationScalarFieldEnum = {
  id: 'id',
  commodityId: 'commodityId',
  sourceRegion: 'sourceRegion',
  targetMarket: 'targetMarket',
  action: 'action',
  confidence: 'confidence',
  expectedMarginMin: 'expectedMarginMin',
  expectedMarginMax: 'expectedMarginMax',
  riskFlags: 'riskFlags',
  assumptions: 'assumptions',
  payload: 'payload',
  validUntil: 'validUntil',
  createdByAgent: 'createdByAgent',
  createdAt: 'createdAt'
};

exports.Prisma.WeatherSnapshotScalarFieldEnum = {
  id: 'id',
  region: 'region',
  forecastDate: 'forecastDate',
  maxTempC: 'maxTempC',
  minTempC: 'minTempC',
  humidityPct: 'humidityPct',
  rainfallMm: 'rainfallMm',
  riskLevel: 'riskLevel',
  source: 'source',
  createdAt: 'createdAt'
};

exports.Prisma.QualitySpecScalarFieldEnum = {
  id: 'id',
  commodityId: 'commodityId',
  grade: 'grade',
  parameter: 'parameter',
  minValue: 'minValue',
  maxValue: 'maxValue',
  checklistNote: 'checklistNote',
  createdAt: 'createdAt'
};

exports.Prisma.StorageProfileScalarFieldEnum = {
  id: 'id',
  commodityId: 'commodityId',
  mode: 'mode',
  tempRange: 'tempRange',
  humidityRange: 'humidityRange',
  maxDays: 'maxDays',
  spoilageRiskNote: 'spoilageRiskNote',
  createdAt: 'createdAt'
};

exports.Prisma.RecommendationOutcomeScalarFieldEnum = {
  id: 'id',
  recommendationId: 'recommendationId',
  executed: 'executed',
  executedQtyTons: 'executedQtyTons',
  realizedBuyAvg: 'realizedBuyAvg',
  realizedSellAvg: 'realizedSellAvg',
  realizedMargin: 'realizedMargin',
  spoilagePct: 'spoilagePct',
  notes: 'notes',
  recordedAt: 'recordedAt'
};

exports.Prisma.SeoContentJobScalarFieldEnum = {
  id: 'id',
  topic: 'topic',
  targetPersona: 'targetPersona',
  primaryKeyword: 'primaryKeyword',
  secondaryKeywords: 'secondaryKeywords',
  status: 'status',
  url: 'url',
  impressions: 'impressions',
  clicks: 'clicks',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.MarketType = exports.$Enums.MarketType = {
  MANDI: 'MANDI',
  WHOLESALE: 'WHOLESALE',
  RETAIL: 'RETAIL',
  EXPORT_HUB: 'EXPORT_HUB'
};

exports.RecommendationAction = exports.$Enums.RecommendationAction = {
  BUY: 'BUY',
  SELL: 'SELL',
  HOLD: 'HOLD'
};

exports.RiskLevel = exports.$Enums.RiskLevel = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

exports.StorageMode = exports.$Enums.StorageMode = {
  COLD: 'COLD',
  DRY: 'DRY'
};

exports.SeoStatus = exports.$Enums.SeoStatus = {
  PLANNED: 'PLANNED',
  DRAFTED: 'DRAFTED',
  PUBLISHED: 'PUBLISHED',
  MEASURED: 'MEASURED'
};

exports.Prisma.ModelName = {
  Commodity: 'Commodity',
  Market: 'Market',
  MandiPrice: 'MandiPrice',
  Recommendation: 'Recommendation',
  WeatherSnapshot: 'WeatherSnapshot',
  QualitySpec: 'QualitySpec',
  StorageProfile: 'StorageProfile',
  RecommendationOutcome: 'RecommendationOutcome',
  SeoContentJob: 'SeoContentJob'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
