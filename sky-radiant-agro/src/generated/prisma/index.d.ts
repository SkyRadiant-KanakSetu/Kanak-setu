
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Commodity
 * 
 */
export type Commodity = $Result.DefaultSelection<Prisma.$CommodityPayload>
/**
 * Model Market
 * 
 */
export type Market = $Result.DefaultSelection<Prisma.$MarketPayload>
/**
 * Model MandiPrice
 * 
 */
export type MandiPrice = $Result.DefaultSelection<Prisma.$MandiPricePayload>
/**
 * Model Recommendation
 * 
 */
export type Recommendation = $Result.DefaultSelection<Prisma.$RecommendationPayload>
/**
 * Model WeatherSnapshot
 * 
 */
export type WeatherSnapshot = $Result.DefaultSelection<Prisma.$WeatherSnapshotPayload>
/**
 * Model QualitySpec
 * 
 */
export type QualitySpec = $Result.DefaultSelection<Prisma.$QualitySpecPayload>
/**
 * Model StorageProfile
 * 
 */
export type StorageProfile = $Result.DefaultSelection<Prisma.$StorageProfilePayload>
/**
 * Model RecommendationOutcome
 * 
 */
export type RecommendationOutcome = $Result.DefaultSelection<Prisma.$RecommendationOutcomePayload>
/**
 * Model SeoContentJob
 * 
 */
export type SeoContentJob = $Result.DefaultSelection<Prisma.$SeoContentJobPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MarketType: {
  MANDI: 'MANDI',
  WHOLESALE: 'WHOLESALE',
  RETAIL: 'RETAIL',
  EXPORT_HUB: 'EXPORT_HUB'
};

export type MarketType = (typeof MarketType)[keyof typeof MarketType]


export const RecommendationAction: {
  BUY: 'BUY',
  SELL: 'SELL',
  HOLD: 'HOLD'
};

export type RecommendationAction = (typeof RecommendationAction)[keyof typeof RecommendationAction]


export const RiskLevel: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel]


export const StorageMode: {
  COLD: 'COLD',
  DRY: 'DRY'
};

export type StorageMode = (typeof StorageMode)[keyof typeof StorageMode]


export const SeoStatus: {
  PLANNED: 'PLANNED',
  DRAFTED: 'DRAFTED',
  PUBLISHED: 'PUBLISHED',
  MEASURED: 'MEASURED'
};

export type SeoStatus = (typeof SeoStatus)[keyof typeof SeoStatus]

}

export type MarketType = $Enums.MarketType

export const MarketType: typeof $Enums.MarketType

export type RecommendationAction = $Enums.RecommendationAction

export const RecommendationAction: typeof $Enums.RecommendationAction

export type RiskLevel = $Enums.RiskLevel

export const RiskLevel: typeof $Enums.RiskLevel

export type StorageMode = $Enums.StorageMode

export const StorageMode: typeof $Enums.StorageMode

export type SeoStatus = $Enums.SeoStatus

export const SeoStatus: typeof $Enums.SeoStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Commodities
 * const commodities = await prisma.commodity.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Commodities
   * const commodities = await prisma.commodity.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.commodity`: Exposes CRUD operations for the **Commodity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Commodities
    * const commodities = await prisma.commodity.findMany()
    * ```
    */
  get commodity(): Prisma.CommodityDelegate<ExtArgs>;

  /**
   * `prisma.market`: Exposes CRUD operations for the **Market** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Markets
    * const markets = await prisma.market.findMany()
    * ```
    */
  get market(): Prisma.MarketDelegate<ExtArgs>;

  /**
   * `prisma.mandiPrice`: Exposes CRUD operations for the **MandiPrice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MandiPrices
    * const mandiPrices = await prisma.mandiPrice.findMany()
    * ```
    */
  get mandiPrice(): Prisma.MandiPriceDelegate<ExtArgs>;

  /**
   * `prisma.recommendation`: Exposes CRUD operations for the **Recommendation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Recommendations
    * const recommendations = await prisma.recommendation.findMany()
    * ```
    */
  get recommendation(): Prisma.RecommendationDelegate<ExtArgs>;

  /**
   * `prisma.weatherSnapshot`: Exposes CRUD operations for the **WeatherSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WeatherSnapshots
    * const weatherSnapshots = await prisma.weatherSnapshot.findMany()
    * ```
    */
  get weatherSnapshot(): Prisma.WeatherSnapshotDelegate<ExtArgs>;

  /**
   * `prisma.qualitySpec`: Exposes CRUD operations for the **QualitySpec** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QualitySpecs
    * const qualitySpecs = await prisma.qualitySpec.findMany()
    * ```
    */
  get qualitySpec(): Prisma.QualitySpecDelegate<ExtArgs>;

  /**
   * `prisma.storageProfile`: Exposes CRUD operations for the **StorageProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StorageProfiles
    * const storageProfiles = await prisma.storageProfile.findMany()
    * ```
    */
  get storageProfile(): Prisma.StorageProfileDelegate<ExtArgs>;

  /**
   * `prisma.recommendationOutcome`: Exposes CRUD operations for the **RecommendationOutcome** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RecommendationOutcomes
    * const recommendationOutcomes = await prisma.recommendationOutcome.findMany()
    * ```
    */
  get recommendationOutcome(): Prisma.RecommendationOutcomeDelegate<ExtArgs>;

  /**
   * `prisma.seoContentJob`: Exposes CRUD operations for the **SeoContentJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SeoContentJobs
    * const seoContentJobs = await prisma.seoContentJob.findMany()
    * ```
    */
  get seoContentJob(): Prisma.SeoContentJobDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "commodity" | "market" | "mandiPrice" | "recommendation" | "weatherSnapshot" | "qualitySpec" | "storageProfile" | "recommendationOutcome" | "seoContentJob"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Commodity: {
        payload: Prisma.$CommodityPayload<ExtArgs>
        fields: Prisma.CommodityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommodityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommodityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          findFirst: {
            args: Prisma.CommodityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommodityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          findMany: {
            args: Prisma.CommodityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>[]
          }
          create: {
            args: Prisma.CommodityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          createMany: {
            args: Prisma.CommodityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommodityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>[]
          }
          delete: {
            args: Prisma.CommodityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          update: {
            args: Prisma.CommodityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          deleteMany: {
            args: Prisma.CommodityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommodityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommodityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommodityPayload>
          }
          aggregate: {
            args: Prisma.CommodityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommodity>
          }
          groupBy: {
            args: Prisma.CommodityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommodityGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommodityCountArgs<ExtArgs>
            result: $Utils.Optional<CommodityCountAggregateOutputType> | number
          }
        }
      }
      Market: {
        payload: Prisma.$MarketPayload<ExtArgs>
        fields: Prisma.MarketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MarketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MarketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          findFirst: {
            args: Prisma.MarketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MarketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          findMany: {
            args: Prisma.MarketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>[]
          }
          create: {
            args: Prisma.MarketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          createMany: {
            args: Prisma.MarketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MarketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>[]
          }
          delete: {
            args: Prisma.MarketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          update: {
            args: Prisma.MarketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          deleteMany: {
            args: Prisma.MarketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MarketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MarketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          aggregate: {
            args: Prisma.MarketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMarket>
          }
          groupBy: {
            args: Prisma.MarketGroupByArgs<ExtArgs>
            result: $Utils.Optional<MarketGroupByOutputType>[]
          }
          count: {
            args: Prisma.MarketCountArgs<ExtArgs>
            result: $Utils.Optional<MarketCountAggregateOutputType> | number
          }
        }
      }
      MandiPrice: {
        payload: Prisma.$MandiPricePayload<ExtArgs>
        fields: Prisma.MandiPriceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MandiPriceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MandiPriceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload>
          }
          findFirst: {
            args: Prisma.MandiPriceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MandiPriceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload>
          }
          findMany: {
            args: Prisma.MandiPriceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload>[]
          }
          create: {
            args: Prisma.MandiPriceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload>
          }
          createMany: {
            args: Prisma.MandiPriceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MandiPriceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload>[]
          }
          delete: {
            args: Prisma.MandiPriceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload>
          }
          update: {
            args: Prisma.MandiPriceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload>
          }
          deleteMany: {
            args: Prisma.MandiPriceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MandiPriceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MandiPriceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MandiPricePayload>
          }
          aggregate: {
            args: Prisma.MandiPriceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMandiPrice>
          }
          groupBy: {
            args: Prisma.MandiPriceGroupByArgs<ExtArgs>
            result: $Utils.Optional<MandiPriceGroupByOutputType>[]
          }
          count: {
            args: Prisma.MandiPriceCountArgs<ExtArgs>
            result: $Utils.Optional<MandiPriceCountAggregateOutputType> | number
          }
        }
      }
      Recommendation: {
        payload: Prisma.$RecommendationPayload<ExtArgs>
        fields: Prisma.RecommendationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecommendationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecommendationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          findFirst: {
            args: Prisma.RecommendationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecommendationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          findMany: {
            args: Prisma.RecommendationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>[]
          }
          create: {
            args: Prisma.RecommendationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          createMany: {
            args: Prisma.RecommendationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecommendationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>[]
          }
          delete: {
            args: Prisma.RecommendationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          update: {
            args: Prisma.RecommendationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          deleteMany: {
            args: Prisma.RecommendationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecommendationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RecommendationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationPayload>
          }
          aggregate: {
            args: Prisma.RecommendationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecommendation>
          }
          groupBy: {
            args: Prisma.RecommendationGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecommendationGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecommendationCountArgs<ExtArgs>
            result: $Utils.Optional<RecommendationCountAggregateOutputType> | number
          }
        }
      }
      WeatherSnapshot: {
        payload: Prisma.$WeatherSnapshotPayload<ExtArgs>
        fields: Prisma.WeatherSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WeatherSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WeatherSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload>
          }
          findFirst: {
            args: Prisma.WeatherSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WeatherSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload>
          }
          findMany: {
            args: Prisma.WeatherSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload>[]
          }
          create: {
            args: Prisma.WeatherSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload>
          }
          createMany: {
            args: Prisma.WeatherSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WeatherSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload>[]
          }
          delete: {
            args: Prisma.WeatherSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload>
          }
          update: {
            args: Prisma.WeatherSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.WeatherSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WeatherSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WeatherSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WeatherSnapshotPayload>
          }
          aggregate: {
            args: Prisma.WeatherSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWeatherSnapshot>
          }
          groupBy: {
            args: Prisma.WeatherSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<WeatherSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.WeatherSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<WeatherSnapshotCountAggregateOutputType> | number
          }
        }
      }
      QualitySpec: {
        payload: Prisma.$QualitySpecPayload<ExtArgs>
        fields: Prisma.QualitySpecFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QualitySpecFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QualitySpecFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload>
          }
          findFirst: {
            args: Prisma.QualitySpecFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QualitySpecFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload>
          }
          findMany: {
            args: Prisma.QualitySpecFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload>[]
          }
          create: {
            args: Prisma.QualitySpecCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload>
          }
          createMany: {
            args: Prisma.QualitySpecCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QualitySpecCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload>[]
          }
          delete: {
            args: Prisma.QualitySpecDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload>
          }
          update: {
            args: Prisma.QualitySpecUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload>
          }
          deleteMany: {
            args: Prisma.QualitySpecDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QualitySpecUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QualitySpecUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualitySpecPayload>
          }
          aggregate: {
            args: Prisma.QualitySpecAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQualitySpec>
          }
          groupBy: {
            args: Prisma.QualitySpecGroupByArgs<ExtArgs>
            result: $Utils.Optional<QualitySpecGroupByOutputType>[]
          }
          count: {
            args: Prisma.QualitySpecCountArgs<ExtArgs>
            result: $Utils.Optional<QualitySpecCountAggregateOutputType> | number
          }
        }
      }
      StorageProfile: {
        payload: Prisma.$StorageProfilePayload<ExtArgs>
        fields: Prisma.StorageProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StorageProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StorageProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload>
          }
          findFirst: {
            args: Prisma.StorageProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StorageProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload>
          }
          findMany: {
            args: Prisma.StorageProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload>[]
          }
          create: {
            args: Prisma.StorageProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload>
          }
          createMany: {
            args: Prisma.StorageProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StorageProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload>[]
          }
          delete: {
            args: Prisma.StorageProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload>
          }
          update: {
            args: Prisma.StorageProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload>
          }
          deleteMany: {
            args: Prisma.StorageProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StorageProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StorageProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageProfilePayload>
          }
          aggregate: {
            args: Prisma.StorageProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStorageProfile>
          }
          groupBy: {
            args: Prisma.StorageProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<StorageProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.StorageProfileCountArgs<ExtArgs>
            result: $Utils.Optional<StorageProfileCountAggregateOutputType> | number
          }
        }
      }
      RecommendationOutcome: {
        payload: Prisma.$RecommendationOutcomePayload<ExtArgs>
        fields: Prisma.RecommendationOutcomeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecommendationOutcomeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecommendationOutcomeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload>
          }
          findFirst: {
            args: Prisma.RecommendationOutcomeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecommendationOutcomeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload>
          }
          findMany: {
            args: Prisma.RecommendationOutcomeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload>[]
          }
          create: {
            args: Prisma.RecommendationOutcomeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload>
          }
          createMany: {
            args: Prisma.RecommendationOutcomeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecommendationOutcomeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload>[]
          }
          delete: {
            args: Prisma.RecommendationOutcomeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload>
          }
          update: {
            args: Prisma.RecommendationOutcomeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload>
          }
          deleteMany: {
            args: Prisma.RecommendationOutcomeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecommendationOutcomeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RecommendationOutcomeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecommendationOutcomePayload>
          }
          aggregate: {
            args: Prisma.RecommendationOutcomeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecommendationOutcome>
          }
          groupBy: {
            args: Prisma.RecommendationOutcomeGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecommendationOutcomeGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecommendationOutcomeCountArgs<ExtArgs>
            result: $Utils.Optional<RecommendationOutcomeCountAggregateOutputType> | number
          }
        }
      }
      SeoContentJob: {
        payload: Prisma.$SeoContentJobPayload<ExtArgs>
        fields: Prisma.SeoContentJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeoContentJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeoContentJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload>
          }
          findFirst: {
            args: Prisma.SeoContentJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeoContentJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload>
          }
          findMany: {
            args: Prisma.SeoContentJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload>[]
          }
          create: {
            args: Prisma.SeoContentJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload>
          }
          createMany: {
            args: Prisma.SeoContentJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SeoContentJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload>[]
          }
          delete: {
            args: Prisma.SeoContentJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload>
          }
          update: {
            args: Prisma.SeoContentJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload>
          }
          deleteMany: {
            args: Prisma.SeoContentJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeoContentJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeoContentJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeoContentJobPayload>
          }
          aggregate: {
            args: Prisma.SeoContentJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeoContentJob>
          }
          groupBy: {
            args: Prisma.SeoContentJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeoContentJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeoContentJobCountArgs<ExtArgs>
            result: $Utils.Optional<SeoContentJobCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CommodityCountOutputType
   */

  export type CommodityCountOutputType = {
    mandiPrices: number
    recommendations: number
    qualitySpecs: number
    storageProfiles: number
  }

  export type CommodityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mandiPrices?: boolean | CommodityCountOutputTypeCountMandiPricesArgs
    recommendations?: boolean | CommodityCountOutputTypeCountRecommendationsArgs
    qualitySpecs?: boolean | CommodityCountOutputTypeCountQualitySpecsArgs
    storageProfiles?: boolean | CommodityCountOutputTypeCountStorageProfilesArgs
  }

  // Custom InputTypes
  /**
   * CommodityCountOutputType without action
   */
  export type CommodityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommodityCountOutputType
     */
    select?: CommodityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommodityCountOutputType without action
   */
  export type CommodityCountOutputTypeCountMandiPricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MandiPriceWhereInput
  }

  /**
   * CommodityCountOutputType without action
   */
  export type CommodityCountOutputTypeCountRecommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationWhereInput
  }

  /**
   * CommodityCountOutputType without action
   */
  export type CommodityCountOutputTypeCountQualitySpecsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QualitySpecWhereInput
  }

  /**
   * CommodityCountOutputType without action
   */
  export type CommodityCountOutputTypeCountStorageProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StorageProfileWhereInput
  }


  /**
   * Count Type MarketCountOutputType
   */

  export type MarketCountOutputType = {
    mandiPrices: number
  }

  export type MarketCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mandiPrices?: boolean | MarketCountOutputTypeCountMandiPricesArgs
  }

  // Custom InputTypes
  /**
   * MarketCountOutputType without action
   */
  export type MarketCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketCountOutputType
     */
    select?: MarketCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MarketCountOutputType without action
   */
  export type MarketCountOutputTypeCountMandiPricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MandiPriceWhereInput
  }


  /**
   * Count Type RecommendationCountOutputType
   */

  export type RecommendationCountOutputType = {
    outcomes: number
  }

  export type RecommendationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outcomes?: boolean | RecommendationCountOutputTypeCountOutcomesArgs
  }

  // Custom InputTypes
  /**
   * RecommendationCountOutputType without action
   */
  export type RecommendationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationCountOutputType
     */
    select?: RecommendationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RecommendationCountOutputType without action
   */
  export type RecommendationCountOutputTypeCountOutcomesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationOutcomeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Commodity
   */

  export type AggregateCommodity = {
    _count: CommodityCountAggregateOutputType | null
    _avg: CommodityAvgAggregateOutputType | null
    _sum: CommoditySumAggregateOutputType | null
    _min: CommodityMinAggregateOutputType | null
    _max: CommodityMaxAggregateOutputType | null
  }

  export type CommodityAvgAggregateOutputType = {
    defaultShelfLifeDays: number | null
  }

  export type CommoditySumAggregateOutputType = {
    defaultShelfLifeDays: number | null
  }

  export type CommodityMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    category: string | null
    defaultShelfLifeDays: number | null
    createdAt: Date | null
  }

  export type CommodityMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    category: string | null
    defaultShelfLifeDays: number | null
    createdAt: Date | null
  }

  export type CommodityCountAggregateOutputType = {
    id: number
    code: number
    name: number
    category: number
    defaultShelfLifeDays: number
    createdAt: number
    _all: number
  }


  export type CommodityAvgAggregateInputType = {
    defaultShelfLifeDays?: true
  }

  export type CommoditySumAggregateInputType = {
    defaultShelfLifeDays?: true
  }

  export type CommodityMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    category?: true
    defaultShelfLifeDays?: true
    createdAt?: true
  }

  export type CommodityMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    category?: true
    defaultShelfLifeDays?: true
    createdAt?: true
  }

  export type CommodityCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    category?: true
    defaultShelfLifeDays?: true
    createdAt?: true
    _all?: true
  }

  export type CommodityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Commodity to aggregate.
     */
    where?: CommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commodities to fetch.
     */
    orderBy?: CommodityOrderByWithRelationInput | CommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Commodities
    **/
    _count?: true | CommodityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommodityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommoditySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommodityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommodityMaxAggregateInputType
  }

  export type GetCommodityAggregateType<T extends CommodityAggregateArgs> = {
        [P in keyof T & keyof AggregateCommodity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommodity[P]>
      : GetScalarType<T[P], AggregateCommodity[P]>
  }




  export type CommodityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommodityWhereInput
    orderBy?: CommodityOrderByWithAggregationInput | CommodityOrderByWithAggregationInput[]
    by: CommodityScalarFieldEnum[] | CommodityScalarFieldEnum
    having?: CommodityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommodityCountAggregateInputType | true
    _avg?: CommodityAvgAggregateInputType
    _sum?: CommoditySumAggregateInputType
    _min?: CommodityMinAggregateInputType
    _max?: CommodityMaxAggregateInputType
  }

  export type CommodityGroupByOutputType = {
    id: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt: Date
    _count: CommodityCountAggregateOutputType | null
    _avg: CommodityAvgAggregateOutputType | null
    _sum: CommoditySumAggregateOutputType | null
    _min: CommodityMinAggregateOutputType | null
    _max: CommodityMaxAggregateOutputType | null
  }

  type GetCommodityGroupByPayload<T extends CommodityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommodityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommodityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommodityGroupByOutputType[P]>
            : GetScalarType<T[P], CommodityGroupByOutputType[P]>
        }
      >
    >


  export type CommoditySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    category?: boolean
    defaultShelfLifeDays?: boolean
    createdAt?: boolean
    mandiPrices?: boolean | Commodity$mandiPricesArgs<ExtArgs>
    recommendations?: boolean | Commodity$recommendationsArgs<ExtArgs>
    qualitySpecs?: boolean | Commodity$qualitySpecsArgs<ExtArgs>
    storageProfiles?: boolean | Commodity$storageProfilesArgs<ExtArgs>
    _count?: boolean | CommodityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["commodity"]>

  export type CommoditySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    category?: boolean
    defaultShelfLifeDays?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["commodity"]>

  export type CommoditySelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    category?: boolean
    defaultShelfLifeDays?: boolean
    createdAt?: boolean
  }

  export type CommodityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mandiPrices?: boolean | Commodity$mandiPricesArgs<ExtArgs>
    recommendations?: boolean | Commodity$recommendationsArgs<ExtArgs>
    qualitySpecs?: boolean | Commodity$qualitySpecsArgs<ExtArgs>
    storageProfiles?: boolean | Commodity$storageProfilesArgs<ExtArgs>
    _count?: boolean | CommodityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CommodityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CommodityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Commodity"
    objects: {
      mandiPrices: Prisma.$MandiPricePayload<ExtArgs>[]
      recommendations: Prisma.$RecommendationPayload<ExtArgs>[]
      qualitySpecs: Prisma.$QualitySpecPayload<ExtArgs>[]
      storageProfiles: Prisma.$StorageProfilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      category: string
      defaultShelfLifeDays: number
      createdAt: Date
    }, ExtArgs["result"]["commodity"]>
    composites: {}
  }

  type CommodityGetPayload<S extends boolean | null | undefined | CommodityDefaultArgs> = $Result.GetResult<Prisma.$CommodityPayload, S>

  type CommodityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommodityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommodityCountAggregateInputType | true
    }

  export interface CommodityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Commodity'], meta: { name: 'Commodity' } }
    /**
     * Find zero or one Commodity that matches the filter.
     * @param {CommodityFindUniqueArgs} args - Arguments to find a Commodity
     * @example
     * // Get one Commodity
     * const commodity = await prisma.commodity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommodityFindUniqueArgs>(args: SelectSubset<T, CommodityFindUniqueArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Commodity that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommodityFindUniqueOrThrowArgs} args - Arguments to find a Commodity
     * @example
     * // Get one Commodity
     * const commodity = await prisma.commodity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommodityFindUniqueOrThrowArgs>(args: SelectSubset<T, CommodityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Commodity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityFindFirstArgs} args - Arguments to find a Commodity
     * @example
     * // Get one Commodity
     * const commodity = await prisma.commodity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommodityFindFirstArgs>(args?: SelectSubset<T, CommodityFindFirstArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Commodity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityFindFirstOrThrowArgs} args - Arguments to find a Commodity
     * @example
     * // Get one Commodity
     * const commodity = await prisma.commodity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommodityFindFirstOrThrowArgs>(args?: SelectSubset<T, CommodityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Commodities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Commodities
     * const commodities = await prisma.commodity.findMany()
     * 
     * // Get first 10 Commodities
     * const commodities = await prisma.commodity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commodityWithIdOnly = await prisma.commodity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommodityFindManyArgs>(args?: SelectSubset<T, CommodityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Commodity.
     * @param {CommodityCreateArgs} args - Arguments to create a Commodity.
     * @example
     * // Create one Commodity
     * const Commodity = await prisma.commodity.create({
     *   data: {
     *     // ... data to create a Commodity
     *   }
     * })
     * 
     */
    create<T extends CommodityCreateArgs>(args: SelectSubset<T, CommodityCreateArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Commodities.
     * @param {CommodityCreateManyArgs} args - Arguments to create many Commodities.
     * @example
     * // Create many Commodities
     * const commodity = await prisma.commodity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommodityCreateManyArgs>(args?: SelectSubset<T, CommodityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Commodities and returns the data saved in the database.
     * @param {CommodityCreateManyAndReturnArgs} args - Arguments to create many Commodities.
     * @example
     * // Create many Commodities
     * const commodity = await prisma.commodity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Commodities and only return the `id`
     * const commodityWithIdOnly = await prisma.commodity.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommodityCreateManyAndReturnArgs>(args?: SelectSubset<T, CommodityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Commodity.
     * @param {CommodityDeleteArgs} args - Arguments to delete one Commodity.
     * @example
     * // Delete one Commodity
     * const Commodity = await prisma.commodity.delete({
     *   where: {
     *     // ... filter to delete one Commodity
     *   }
     * })
     * 
     */
    delete<T extends CommodityDeleteArgs>(args: SelectSubset<T, CommodityDeleteArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Commodity.
     * @param {CommodityUpdateArgs} args - Arguments to update one Commodity.
     * @example
     * // Update one Commodity
     * const commodity = await prisma.commodity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommodityUpdateArgs>(args: SelectSubset<T, CommodityUpdateArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Commodities.
     * @param {CommodityDeleteManyArgs} args - Arguments to filter Commodities to delete.
     * @example
     * // Delete a few Commodities
     * const { count } = await prisma.commodity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommodityDeleteManyArgs>(args?: SelectSubset<T, CommodityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Commodities
     * const commodity = await prisma.commodity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommodityUpdateManyArgs>(args: SelectSubset<T, CommodityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Commodity.
     * @param {CommodityUpsertArgs} args - Arguments to update or create a Commodity.
     * @example
     * // Update or create a Commodity
     * const commodity = await prisma.commodity.upsert({
     *   create: {
     *     // ... data to create a Commodity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Commodity we want to update
     *   }
     * })
     */
    upsert<T extends CommodityUpsertArgs>(args: SelectSubset<T, CommodityUpsertArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Commodities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityCountArgs} args - Arguments to filter Commodities to count.
     * @example
     * // Count the number of Commodities
     * const count = await prisma.commodity.count({
     *   where: {
     *     // ... the filter for the Commodities we want to count
     *   }
     * })
    **/
    count<T extends CommodityCountArgs>(
      args?: Subset<T, CommodityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommodityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Commodity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommodityAggregateArgs>(args: Subset<T, CommodityAggregateArgs>): Prisma.PrismaPromise<GetCommodityAggregateType<T>>

    /**
     * Group by Commodity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommodityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommodityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommodityGroupByArgs['orderBy'] }
        : { orderBy?: CommodityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommodityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommodityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Commodity model
   */
  readonly fields: CommodityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Commodity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommodityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mandiPrices<T extends Commodity$mandiPricesArgs<ExtArgs> = {}>(args?: Subset<T, Commodity$mandiPricesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "findMany"> | Null>
    recommendations<T extends Commodity$recommendationsArgs<ExtArgs> = {}>(args?: Subset<T, Commodity$recommendationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findMany"> | Null>
    qualitySpecs<T extends Commodity$qualitySpecsArgs<ExtArgs> = {}>(args?: Subset<T, Commodity$qualitySpecsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "findMany"> | Null>
    storageProfiles<T extends Commodity$storageProfilesArgs<ExtArgs> = {}>(args?: Subset<T, Commodity$storageProfilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Commodity model
   */ 
  interface CommodityFieldRefs {
    readonly id: FieldRef<"Commodity", 'String'>
    readonly code: FieldRef<"Commodity", 'String'>
    readonly name: FieldRef<"Commodity", 'String'>
    readonly category: FieldRef<"Commodity", 'String'>
    readonly defaultShelfLifeDays: FieldRef<"Commodity", 'Int'>
    readonly createdAt: FieldRef<"Commodity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Commodity findUnique
   */
  export type CommodityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodity to fetch.
     */
    where: CommodityWhereUniqueInput
  }

  /**
   * Commodity findUniqueOrThrow
   */
  export type CommodityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodity to fetch.
     */
    where: CommodityWhereUniqueInput
  }

  /**
   * Commodity findFirst
   */
  export type CommodityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodity to fetch.
     */
    where?: CommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commodities to fetch.
     */
    orderBy?: CommodityOrderByWithRelationInput | CommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Commodities.
     */
    cursor?: CommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commodities.
     */
    distinct?: CommodityScalarFieldEnum | CommodityScalarFieldEnum[]
  }

  /**
   * Commodity findFirstOrThrow
   */
  export type CommodityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodity to fetch.
     */
    where?: CommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commodities to fetch.
     */
    orderBy?: CommodityOrderByWithRelationInput | CommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Commodities.
     */
    cursor?: CommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commodities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commodities.
     */
    distinct?: CommodityScalarFieldEnum | CommodityScalarFieldEnum[]
  }

  /**
   * Commodity findMany
   */
  export type CommodityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter, which Commodities to fetch.
     */
    where?: CommodityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commodities to fetch.
     */
    orderBy?: CommodityOrderByWithRelationInput | CommodityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Commodities.
     */
    cursor?: CommodityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commodities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commodities.
     */
    skip?: number
    distinct?: CommodityScalarFieldEnum | CommodityScalarFieldEnum[]
  }

  /**
   * Commodity create
   */
  export type CommodityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * The data needed to create a Commodity.
     */
    data: XOR<CommodityCreateInput, CommodityUncheckedCreateInput>
  }

  /**
   * Commodity createMany
   */
  export type CommodityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Commodities.
     */
    data: CommodityCreateManyInput | CommodityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Commodity createManyAndReturn
   */
  export type CommodityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Commodities.
     */
    data: CommodityCreateManyInput | CommodityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Commodity update
   */
  export type CommodityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * The data needed to update a Commodity.
     */
    data: XOR<CommodityUpdateInput, CommodityUncheckedUpdateInput>
    /**
     * Choose, which Commodity to update.
     */
    where: CommodityWhereUniqueInput
  }

  /**
   * Commodity updateMany
   */
  export type CommodityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Commodities.
     */
    data: XOR<CommodityUpdateManyMutationInput, CommodityUncheckedUpdateManyInput>
    /**
     * Filter which Commodities to update
     */
    where?: CommodityWhereInput
  }

  /**
   * Commodity upsert
   */
  export type CommodityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * The filter to search for the Commodity to update in case it exists.
     */
    where: CommodityWhereUniqueInput
    /**
     * In case the Commodity found by the `where` argument doesn't exist, create a new Commodity with this data.
     */
    create: XOR<CommodityCreateInput, CommodityUncheckedCreateInput>
    /**
     * In case the Commodity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommodityUpdateInput, CommodityUncheckedUpdateInput>
  }

  /**
   * Commodity delete
   */
  export type CommodityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
    /**
     * Filter which Commodity to delete.
     */
    where: CommodityWhereUniqueInput
  }

  /**
   * Commodity deleteMany
   */
  export type CommodityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Commodities to delete
     */
    where?: CommodityWhereInput
  }

  /**
   * Commodity.mandiPrices
   */
  export type Commodity$mandiPricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    where?: MandiPriceWhereInput
    orderBy?: MandiPriceOrderByWithRelationInput | MandiPriceOrderByWithRelationInput[]
    cursor?: MandiPriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MandiPriceScalarFieldEnum | MandiPriceScalarFieldEnum[]
  }

  /**
   * Commodity.recommendations
   */
  export type Commodity$recommendationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    where?: RecommendationWhereInput
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    cursor?: RecommendationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * Commodity.qualitySpecs
   */
  export type Commodity$qualitySpecsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    where?: QualitySpecWhereInput
    orderBy?: QualitySpecOrderByWithRelationInput | QualitySpecOrderByWithRelationInput[]
    cursor?: QualitySpecWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QualitySpecScalarFieldEnum | QualitySpecScalarFieldEnum[]
  }

  /**
   * Commodity.storageProfiles
   */
  export type Commodity$storageProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    where?: StorageProfileWhereInput
    orderBy?: StorageProfileOrderByWithRelationInput | StorageProfileOrderByWithRelationInput[]
    cursor?: StorageProfileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StorageProfileScalarFieldEnum | StorageProfileScalarFieldEnum[]
  }

  /**
   * Commodity without action
   */
  export type CommodityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commodity
     */
    select?: CommoditySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommodityInclude<ExtArgs> | null
  }


  /**
   * Model Market
   */

  export type AggregateMarket = {
    _count: MarketCountAggregateOutputType | null
    _min: MarketMinAggregateOutputType | null
    _max: MarketMaxAggregateOutputType | null
  }

  export type MarketMinAggregateOutputType = {
    id: string | null
    name: string | null
    region: string | null
    type: $Enums.MarketType | null
    createdAt: Date | null
  }

  export type MarketMaxAggregateOutputType = {
    id: string | null
    name: string | null
    region: string | null
    type: $Enums.MarketType | null
    createdAt: Date | null
  }

  export type MarketCountAggregateOutputType = {
    id: number
    name: number
    region: number
    type: number
    createdAt: number
    _all: number
  }


  export type MarketMinAggregateInputType = {
    id?: true
    name?: true
    region?: true
    type?: true
    createdAt?: true
  }

  export type MarketMaxAggregateInputType = {
    id?: true
    name?: true
    region?: true
    type?: true
    createdAt?: true
  }

  export type MarketCountAggregateInputType = {
    id?: true
    name?: true
    region?: true
    type?: true
    createdAt?: true
    _all?: true
  }

  export type MarketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Market to aggregate.
     */
    where?: MarketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Markets to fetch.
     */
    orderBy?: MarketOrderByWithRelationInput | MarketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MarketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Markets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Markets
    **/
    _count?: true | MarketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MarketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MarketMaxAggregateInputType
  }

  export type GetMarketAggregateType<T extends MarketAggregateArgs> = {
        [P in keyof T & keyof AggregateMarket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMarket[P]>
      : GetScalarType<T[P], AggregateMarket[P]>
  }




  export type MarketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MarketWhereInput
    orderBy?: MarketOrderByWithAggregationInput | MarketOrderByWithAggregationInput[]
    by: MarketScalarFieldEnum[] | MarketScalarFieldEnum
    having?: MarketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MarketCountAggregateInputType | true
    _min?: MarketMinAggregateInputType
    _max?: MarketMaxAggregateInputType
  }

  export type MarketGroupByOutputType = {
    id: string
    name: string
    region: string
    type: $Enums.MarketType
    createdAt: Date
    _count: MarketCountAggregateOutputType | null
    _min: MarketMinAggregateOutputType | null
    _max: MarketMaxAggregateOutputType | null
  }

  type GetMarketGroupByPayload<T extends MarketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MarketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MarketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MarketGroupByOutputType[P]>
            : GetScalarType<T[P], MarketGroupByOutputType[P]>
        }
      >
    >


  export type MarketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    region?: boolean
    type?: boolean
    createdAt?: boolean
    mandiPrices?: boolean | Market$mandiPricesArgs<ExtArgs>
    _count?: boolean | MarketCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["market"]>

  export type MarketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    region?: boolean
    type?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["market"]>

  export type MarketSelectScalar = {
    id?: boolean
    name?: boolean
    region?: boolean
    type?: boolean
    createdAt?: boolean
  }

  export type MarketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mandiPrices?: boolean | Market$mandiPricesArgs<ExtArgs>
    _count?: boolean | MarketCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MarketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MarketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Market"
    objects: {
      mandiPrices: Prisma.$MandiPricePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      region: string
      type: $Enums.MarketType
      createdAt: Date
    }, ExtArgs["result"]["market"]>
    composites: {}
  }

  type MarketGetPayload<S extends boolean | null | undefined | MarketDefaultArgs> = $Result.GetResult<Prisma.$MarketPayload, S>

  type MarketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MarketFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MarketCountAggregateInputType | true
    }

  export interface MarketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Market'], meta: { name: 'Market' } }
    /**
     * Find zero or one Market that matches the filter.
     * @param {MarketFindUniqueArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarketFindUniqueArgs>(args: SelectSubset<T, MarketFindUniqueArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Market that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MarketFindUniqueOrThrowArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarketFindUniqueOrThrowArgs>(args: SelectSubset<T, MarketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Market that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindFirstArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarketFindFirstArgs>(args?: SelectSubset<T, MarketFindFirstArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Market that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindFirstOrThrowArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarketFindFirstOrThrowArgs>(args?: SelectSubset<T, MarketFindFirstOrThrowArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Markets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Markets
     * const markets = await prisma.market.findMany()
     * 
     * // Get first 10 Markets
     * const markets = await prisma.market.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const marketWithIdOnly = await prisma.market.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MarketFindManyArgs>(args?: SelectSubset<T, MarketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Market.
     * @param {MarketCreateArgs} args - Arguments to create a Market.
     * @example
     * // Create one Market
     * const Market = await prisma.market.create({
     *   data: {
     *     // ... data to create a Market
     *   }
     * })
     * 
     */
    create<T extends MarketCreateArgs>(args: SelectSubset<T, MarketCreateArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Markets.
     * @param {MarketCreateManyArgs} args - Arguments to create many Markets.
     * @example
     * // Create many Markets
     * const market = await prisma.market.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MarketCreateManyArgs>(args?: SelectSubset<T, MarketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Markets and returns the data saved in the database.
     * @param {MarketCreateManyAndReturnArgs} args - Arguments to create many Markets.
     * @example
     * // Create many Markets
     * const market = await prisma.market.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Markets and only return the `id`
     * const marketWithIdOnly = await prisma.market.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MarketCreateManyAndReturnArgs>(args?: SelectSubset<T, MarketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Market.
     * @param {MarketDeleteArgs} args - Arguments to delete one Market.
     * @example
     * // Delete one Market
     * const Market = await prisma.market.delete({
     *   where: {
     *     // ... filter to delete one Market
     *   }
     * })
     * 
     */
    delete<T extends MarketDeleteArgs>(args: SelectSubset<T, MarketDeleteArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Market.
     * @param {MarketUpdateArgs} args - Arguments to update one Market.
     * @example
     * // Update one Market
     * const market = await prisma.market.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MarketUpdateArgs>(args: SelectSubset<T, MarketUpdateArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Markets.
     * @param {MarketDeleteManyArgs} args - Arguments to filter Markets to delete.
     * @example
     * // Delete a few Markets
     * const { count } = await prisma.market.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MarketDeleteManyArgs>(args?: SelectSubset<T, MarketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Markets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Markets
     * const market = await prisma.market.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MarketUpdateManyArgs>(args: SelectSubset<T, MarketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Market.
     * @param {MarketUpsertArgs} args - Arguments to update or create a Market.
     * @example
     * // Update or create a Market
     * const market = await prisma.market.upsert({
     *   create: {
     *     // ... data to create a Market
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Market we want to update
     *   }
     * })
     */
    upsert<T extends MarketUpsertArgs>(args: SelectSubset<T, MarketUpsertArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Markets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketCountArgs} args - Arguments to filter Markets to count.
     * @example
     * // Count the number of Markets
     * const count = await prisma.market.count({
     *   where: {
     *     // ... the filter for the Markets we want to count
     *   }
     * })
    **/
    count<T extends MarketCountArgs>(
      args?: Subset<T, MarketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MarketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Market.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MarketAggregateArgs>(args: Subset<T, MarketAggregateArgs>): Prisma.PrismaPromise<GetMarketAggregateType<T>>

    /**
     * Group by Market.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MarketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MarketGroupByArgs['orderBy'] }
        : { orderBy?: MarketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MarketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Market model
   */
  readonly fields: MarketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Market.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MarketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mandiPrices<T extends Market$mandiPricesArgs<ExtArgs> = {}>(args?: Subset<T, Market$mandiPricesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Market model
   */ 
  interface MarketFieldRefs {
    readonly id: FieldRef<"Market", 'String'>
    readonly name: FieldRef<"Market", 'String'>
    readonly region: FieldRef<"Market", 'String'>
    readonly type: FieldRef<"Market", 'MarketType'>
    readonly createdAt: FieldRef<"Market", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Market findUnique
   */
  export type MarketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Market to fetch.
     */
    where: MarketWhereUniqueInput
  }

  /**
   * Market findUniqueOrThrow
   */
  export type MarketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Market to fetch.
     */
    where: MarketWhereUniqueInput
  }

  /**
   * Market findFirst
   */
  export type MarketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Market to fetch.
     */
    where?: MarketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Markets to fetch.
     */
    orderBy?: MarketOrderByWithRelationInput | MarketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Markets.
     */
    cursor?: MarketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Markets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Markets.
     */
    distinct?: MarketScalarFieldEnum | MarketScalarFieldEnum[]
  }

  /**
   * Market findFirstOrThrow
   */
  export type MarketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Market to fetch.
     */
    where?: MarketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Markets to fetch.
     */
    orderBy?: MarketOrderByWithRelationInput | MarketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Markets.
     */
    cursor?: MarketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Markets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Markets.
     */
    distinct?: MarketScalarFieldEnum | MarketScalarFieldEnum[]
  }

  /**
   * Market findMany
   */
  export type MarketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Markets to fetch.
     */
    where?: MarketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Markets to fetch.
     */
    orderBy?: MarketOrderByWithRelationInput | MarketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Markets.
     */
    cursor?: MarketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Markets.
     */
    skip?: number
    distinct?: MarketScalarFieldEnum | MarketScalarFieldEnum[]
  }

  /**
   * Market create
   */
  export type MarketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * The data needed to create a Market.
     */
    data: XOR<MarketCreateInput, MarketUncheckedCreateInput>
  }

  /**
   * Market createMany
   */
  export type MarketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Markets.
     */
    data: MarketCreateManyInput | MarketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Market createManyAndReturn
   */
  export type MarketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Markets.
     */
    data: MarketCreateManyInput | MarketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Market update
   */
  export type MarketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * The data needed to update a Market.
     */
    data: XOR<MarketUpdateInput, MarketUncheckedUpdateInput>
    /**
     * Choose, which Market to update.
     */
    where: MarketWhereUniqueInput
  }

  /**
   * Market updateMany
   */
  export type MarketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Markets.
     */
    data: XOR<MarketUpdateManyMutationInput, MarketUncheckedUpdateManyInput>
    /**
     * Filter which Markets to update
     */
    where?: MarketWhereInput
  }

  /**
   * Market upsert
   */
  export type MarketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * The filter to search for the Market to update in case it exists.
     */
    where: MarketWhereUniqueInput
    /**
     * In case the Market found by the `where` argument doesn't exist, create a new Market with this data.
     */
    create: XOR<MarketCreateInput, MarketUncheckedCreateInput>
    /**
     * In case the Market was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MarketUpdateInput, MarketUncheckedUpdateInput>
  }

  /**
   * Market delete
   */
  export type MarketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter which Market to delete.
     */
    where: MarketWhereUniqueInput
  }

  /**
   * Market deleteMany
   */
  export type MarketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Markets to delete
     */
    where?: MarketWhereInput
  }

  /**
   * Market.mandiPrices
   */
  export type Market$mandiPricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    where?: MandiPriceWhereInput
    orderBy?: MandiPriceOrderByWithRelationInput | MandiPriceOrderByWithRelationInput[]
    cursor?: MandiPriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MandiPriceScalarFieldEnum | MandiPriceScalarFieldEnum[]
  }

  /**
   * Market without action
   */
  export type MarketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
  }


  /**
   * Model MandiPrice
   */

  export type AggregateMandiPrice = {
    _count: MandiPriceCountAggregateOutputType | null
    _avg: MandiPriceAvgAggregateOutputType | null
    _sum: MandiPriceSumAggregateOutputType | null
    _min: MandiPriceMinAggregateOutputType | null
    _max: MandiPriceMaxAggregateOutputType | null
  }

  export type MandiPriceAvgAggregateOutputType = {
    priceMin: Decimal | null
    priceMax: Decimal | null
    priceModal: Decimal | null
  }

  export type MandiPriceSumAggregateOutputType = {
    priceMin: Decimal | null
    priceMax: Decimal | null
    priceModal: Decimal | null
  }

  export type MandiPriceMinAggregateOutputType = {
    id: string | null
    commodityId: string | null
    marketId: string | null
    priceMin: Decimal | null
    priceMax: Decimal | null
    priceModal: Decimal | null
    observedAt: Date | null
    source: string | null
    createdAt: Date | null
  }

  export type MandiPriceMaxAggregateOutputType = {
    id: string | null
    commodityId: string | null
    marketId: string | null
    priceMin: Decimal | null
    priceMax: Decimal | null
    priceModal: Decimal | null
    observedAt: Date | null
    source: string | null
    createdAt: Date | null
  }

  export type MandiPriceCountAggregateOutputType = {
    id: number
    commodityId: number
    marketId: number
    priceMin: number
    priceMax: number
    priceModal: number
    observedAt: number
    source: number
    createdAt: number
    _all: number
  }


  export type MandiPriceAvgAggregateInputType = {
    priceMin?: true
    priceMax?: true
    priceModal?: true
  }

  export type MandiPriceSumAggregateInputType = {
    priceMin?: true
    priceMax?: true
    priceModal?: true
  }

  export type MandiPriceMinAggregateInputType = {
    id?: true
    commodityId?: true
    marketId?: true
    priceMin?: true
    priceMax?: true
    priceModal?: true
    observedAt?: true
    source?: true
    createdAt?: true
  }

  export type MandiPriceMaxAggregateInputType = {
    id?: true
    commodityId?: true
    marketId?: true
    priceMin?: true
    priceMax?: true
    priceModal?: true
    observedAt?: true
    source?: true
    createdAt?: true
  }

  export type MandiPriceCountAggregateInputType = {
    id?: true
    commodityId?: true
    marketId?: true
    priceMin?: true
    priceMax?: true
    priceModal?: true
    observedAt?: true
    source?: true
    createdAt?: true
    _all?: true
  }

  export type MandiPriceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MandiPrice to aggregate.
     */
    where?: MandiPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MandiPrices to fetch.
     */
    orderBy?: MandiPriceOrderByWithRelationInput | MandiPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MandiPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MandiPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MandiPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MandiPrices
    **/
    _count?: true | MandiPriceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MandiPriceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MandiPriceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MandiPriceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MandiPriceMaxAggregateInputType
  }

  export type GetMandiPriceAggregateType<T extends MandiPriceAggregateArgs> = {
        [P in keyof T & keyof AggregateMandiPrice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMandiPrice[P]>
      : GetScalarType<T[P], AggregateMandiPrice[P]>
  }




  export type MandiPriceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MandiPriceWhereInput
    orderBy?: MandiPriceOrderByWithAggregationInput | MandiPriceOrderByWithAggregationInput[]
    by: MandiPriceScalarFieldEnum[] | MandiPriceScalarFieldEnum
    having?: MandiPriceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MandiPriceCountAggregateInputType | true
    _avg?: MandiPriceAvgAggregateInputType
    _sum?: MandiPriceSumAggregateInputType
    _min?: MandiPriceMinAggregateInputType
    _max?: MandiPriceMaxAggregateInputType
  }

  export type MandiPriceGroupByOutputType = {
    id: string
    commodityId: string
    marketId: string
    priceMin: Decimal
    priceMax: Decimal
    priceModal: Decimal
    observedAt: Date
    source: string
    createdAt: Date
    _count: MandiPriceCountAggregateOutputType | null
    _avg: MandiPriceAvgAggregateOutputType | null
    _sum: MandiPriceSumAggregateOutputType | null
    _min: MandiPriceMinAggregateOutputType | null
    _max: MandiPriceMaxAggregateOutputType | null
  }

  type GetMandiPriceGroupByPayload<T extends MandiPriceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MandiPriceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MandiPriceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MandiPriceGroupByOutputType[P]>
            : GetScalarType<T[P], MandiPriceGroupByOutputType[P]>
        }
      >
    >


  export type MandiPriceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commodityId?: boolean
    marketId?: boolean
    priceMin?: boolean
    priceMax?: boolean
    priceModal?: boolean
    observedAt?: boolean
    source?: boolean
    createdAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mandiPrice"]>

  export type MandiPriceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commodityId?: boolean
    marketId?: boolean
    priceMin?: boolean
    priceMax?: boolean
    priceModal?: boolean
    observedAt?: boolean
    source?: boolean
    createdAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mandiPrice"]>

  export type MandiPriceSelectScalar = {
    id?: boolean
    commodityId?: boolean
    marketId?: boolean
    priceMin?: boolean
    priceMax?: boolean
    priceModal?: boolean
    observedAt?: boolean
    source?: boolean
    createdAt?: boolean
  }

  export type MandiPriceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }
  export type MandiPriceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }

  export type $MandiPricePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MandiPrice"
    objects: {
      commodity: Prisma.$CommodityPayload<ExtArgs>
      market: Prisma.$MarketPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      commodityId: string
      marketId: string
      priceMin: Prisma.Decimal
      priceMax: Prisma.Decimal
      priceModal: Prisma.Decimal
      observedAt: Date
      source: string
      createdAt: Date
    }, ExtArgs["result"]["mandiPrice"]>
    composites: {}
  }

  type MandiPriceGetPayload<S extends boolean | null | undefined | MandiPriceDefaultArgs> = $Result.GetResult<Prisma.$MandiPricePayload, S>

  type MandiPriceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MandiPriceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MandiPriceCountAggregateInputType | true
    }

  export interface MandiPriceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MandiPrice'], meta: { name: 'MandiPrice' } }
    /**
     * Find zero or one MandiPrice that matches the filter.
     * @param {MandiPriceFindUniqueArgs} args - Arguments to find a MandiPrice
     * @example
     * // Get one MandiPrice
     * const mandiPrice = await prisma.mandiPrice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MandiPriceFindUniqueArgs>(args: SelectSubset<T, MandiPriceFindUniqueArgs<ExtArgs>>): Prisma__MandiPriceClient<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MandiPrice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MandiPriceFindUniqueOrThrowArgs} args - Arguments to find a MandiPrice
     * @example
     * // Get one MandiPrice
     * const mandiPrice = await prisma.mandiPrice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MandiPriceFindUniqueOrThrowArgs>(args: SelectSubset<T, MandiPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MandiPriceClient<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MandiPrice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MandiPriceFindFirstArgs} args - Arguments to find a MandiPrice
     * @example
     * // Get one MandiPrice
     * const mandiPrice = await prisma.mandiPrice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MandiPriceFindFirstArgs>(args?: SelectSubset<T, MandiPriceFindFirstArgs<ExtArgs>>): Prisma__MandiPriceClient<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MandiPrice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MandiPriceFindFirstOrThrowArgs} args - Arguments to find a MandiPrice
     * @example
     * // Get one MandiPrice
     * const mandiPrice = await prisma.mandiPrice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MandiPriceFindFirstOrThrowArgs>(args?: SelectSubset<T, MandiPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma__MandiPriceClient<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MandiPrices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MandiPriceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MandiPrices
     * const mandiPrices = await prisma.mandiPrice.findMany()
     * 
     * // Get first 10 MandiPrices
     * const mandiPrices = await prisma.mandiPrice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mandiPriceWithIdOnly = await prisma.mandiPrice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MandiPriceFindManyArgs>(args?: SelectSubset<T, MandiPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MandiPrice.
     * @param {MandiPriceCreateArgs} args - Arguments to create a MandiPrice.
     * @example
     * // Create one MandiPrice
     * const MandiPrice = await prisma.mandiPrice.create({
     *   data: {
     *     // ... data to create a MandiPrice
     *   }
     * })
     * 
     */
    create<T extends MandiPriceCreateArgs>(args: SelectSubset<T, MandiPriceCreateArgs<ExtArgs>>): Prisma__MandiPriceClient<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MandiPrices.
     * @param {MandiPriceCreateManyArgs} args - Arguments to create many MandiPrices.
     * @example
     * // Create many MandiPrices
     * const mandiPrice = await prisma.mandiPrice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MandiPriceCreateManyArgs>(args?: SelectSubset<T, MandiPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MandiPrices and returns the data saved in the database.
     * @param {MandiPriceCreateManyAndReturnArgs} args - Arguments to create many MandiPrices.
     * @example
     * // Create many MandiPrices
     * const mandiPrice = await prisma.mandiPrice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MandiPrices and only return the `id`
     * const mandiPriceWithIdOnly = await prisma.mandiPrice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MandiPriceCreateManyAndReturnArgs>(args?: SelectSubset<T, MandiPriceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MandiPrice.
     * @param {MandiPriceDeleteArgs} args - Arguments to delete one MandiPrice.
     * @example
     * // Delete one MandiPrice
     * const MandiPrice = await prisma.mandiPrice.delete({
     *   where: {
     *     // ... filter to delete one MandiPrice
     *   }
     * })
     * 
     */
    delete<T extends MandiPriceDeleteArgs>(args: SelectSubset<T, MandiPriceDeleteArgs<ExtArgs>>): Prisma__MandiPriceClient<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MandiPrice.
     * @param {MandiPriceUpdateArgs} args - Arguments to update one MandiPrice.
     * @example
     * // Update one MandiPrice
     * const mandiPrice = await prisma.mandiPrice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MandiPriceUpdateArgs>(args: SelectSubset<T, MandiPriceUpdateArgs<ExtArgs>>): Prisma__MandiPriceClient<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MandiPrices.
     * @param {MandiPriceDeleteManyArgs} args - Arguments to filter MandiPrices to delete.
     * @example
     * // Delete a few MandiPrices
     * const { count } = await prisma.mandiPrice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MandiPriceDeleteManyArgs>(args?: SelectSubset<T, MandiPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MandiPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MandiPriceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MandiPrices
     * const mandiPrice = await prisma.mandiPrice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MandiPriceUpdateManyArgs>(args: SelectSubset<T, MandiPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MandiPrice.
     * @param {MandiPriceUpsertArgs} args - Arguments to update or create a MandiPrice.
     * @example
     * // Update or create a MandiPrice
     * const mandiPrice = await prisma.mandiPrice.upsert({
     *   create: {
     *     // ... data to create a MandiPrice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MandiPrice we want to update
     *   }
     * })
     */
    upsert<T extends MandiPriceUpsertArgs>(args: SelectSubset<T, MandiPriceUpsertArgs<ExtArgs>>): Prisma__MandiPriceClient<$Result.GetResult<Prisma.$MandiPricePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MandiPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MandiPriceCountArgs} args - Arguments to filter MandiPrices to count.
     * @example
     * // Count the number of MandiPrices
     * const count = await prisma.mandiPrice.count({
     *   where: {
     *     // ... the filter for the MandiPrices we want to count
     *   }
     * })
    **/
    count<T extends MandiPriceCountArgs>(
      args?: Subset<T, MandiPriceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MandiPriceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MandiPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MandiPriceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MandiPriceAggregateArgs>(args: Subset<T, MandiPriceAggregateArgs>): Prisma.PrismaPromise<GetMandiPriceAggregateType<T>>

    /**
     * Group by MandiPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MandiPriceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MandiPriceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MandiPriceGroupByArgs['orderBy'] }
        : { orderBy?: MandiPriceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MandiPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMandiPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MandiPrice model
   */
  readonly fields: MandiPriceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MandiPrice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MandiPriceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    commodity<T extends CommodityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommodityDefaultArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    market<T extends MarketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MarketDefaultArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MandiPrice model
   */ 
  interface MandiPriceFieldRefs {
    readonly id: FieldRef<"MandiPrice", 'String'>
    readonly commodityId: FieldRef<"MandiPrice", 'String'>
    readonly marketId: FieldRef<"MandiPrice", 'String'>
    readonly priceMin: FieldRef<"MandiPrice", 'Decimal'>
    readonly priceMax: FieldRef<"MandiPrice", 'Decimal'>
    readonly priceModal: FieldRef<"MandiPrice", 'Decimal'>
    readonly observedAt: FieldRef<"MandiPrice", 'DateTime'>
    readonly source: FieldRef<"MandiPrice", 'String'>
    readonly createdAt: FieldRef<"MandiPrice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MandiPrice findUnique
   */
  export type MandiPriceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * Filter, which MandiPrice to fetch.
     */
    where: MandiPriceWhereUniqueInput
  }

  /**
   * MandiPrice findUniqueOrThrow
   */
  export type MandiPriceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * Filter, which MandiPrice to fetch.
     */
    where: MandiPriceWhereUniqueInput
  }

  /**
   * MandiPrice findFirst
   */
  export type MandiPriceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * Filter, which MandiPrice to fetch.
     */
    where?: MandiPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MandiPrices to fetch.
     */
    orderBy?: MandiPriceOrderByWithRelationInput | MandiPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MandiPrices.
     */
    cursor?: MandiPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MandiPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MandiPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MandiPrices.
     */
    distinct?: MandiPriceScalarFieldEnum | MandiPriceScalarFieldEnum[]
  }

  /**
   * MandiPrice findFirstOrThrow
   */
  export type MandiPriceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * Filter, which MandiPrice to fetch.
     */
    where?: MandiPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MandiPrices to fetch.
     */
    orderBy?: MandiPriceOrderByWithRelationInput | MandiPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MandiPrices.
     */
    cursor?: MandiPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MandiPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MandiPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MandiPrices.
     */
    distinct?: MandiPriceScalarFieldEnum | MandiPriceScalarFieldEnum[]
  }

  /**
   * MandiPrice findMany
   */
  export type MandiPriceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * Filter, which MandiPrices to fetch.
     */
    where?: MandiPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MandiPrices to fetch.
     */
    orderBy?: MandiPriceOrderByWithRelationInput | MandiPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MandiPrices.
     */
    cursor?: MandiPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MandiPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MandiPrices.
     */
    skip?: number
    distinct?: MandiPriceScalarFieldEnum | MandiPriceScalarFieldEnum[]
  }

  /**
   * MandiPrice create
   */
  export type MandiPriceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * The data needed to create a MandiPrice.
     */
    data: XOR<MandiPriceCreateInput, MandiPriceUncheckedCreateInput>
  }

  /**
   * MandiPrice createMany
   */
  export type MandiPriceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MandiPrices.
     */
    data: MandiPriceCreateManyInput | MandiPriceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MandiPrice createManyAndReturn
   */
  export type MandiPriceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MandiPrices.
     */
    data: MandiPriceCreateManyInput | MandiPriceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MandiPrice update
   */
  export type MandiPriceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * The data needed to update a MandiPrice.
     */
    data: XOR<MandiPriceUpdateInput, MandiPriceUncheckedUpdateInput>
    /**
     * Choose, which MandiPrice to update.
     */
    where: MandiPriceWhereUniqueInput
  }

  /**
   * MandiPrice updateMany
   */
  export type MandiPriceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MandiPrices.
     */
    data: XOR<MandiPriceUpdateManyMutationInput, MandiPriceUncheckedUpdateManyInput>
    /**
     * Filter which MandiPrices to update
     */
    where?: MandiPriceWhereInput
  }

  /**
   * MandiPrice upsert
   */
  export type MandiPriceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * The filter to search for the MandiPrice to update in case it exists.
     */
    where: MandiPriceWhereUniqueInput
    /**
     * In case the MandiPrice found by the `where` argument doesn't exist, create a new MandiPrice with this data.
     */
    create: XOR<MandiPriceCreateInput, MandiPriceUncheckedCreateInput>
    /**
     * In case the MandiPrice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MandiPriceUpdateInput, MandiPriceUncheckedUpdateInput>
  }

  /**
   * MandiPrice delete
   */
  export type MandiPriceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
    /**
     * Filter which MandiPrice to delete.
     */
    where: MandiPriceWhereUniqueInput
  }

  /**
   * MandiPrice deleteMany
   */
  export type MandiPriceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MandiPrices to delete
     */
    where?: MandiPriceWhereInput
  }

  /**
   * MandiPrice without action
   */
  export type MandiPriceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MandiPrice
     */
    select?: MandiPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MandiPriceInclude<ExtArgs> | null
  }


  /**
   * Model Recommendation
   */

  export type AggregateRecommendation = {
    _count: RecommendationCountAggregateOutputType | null
    _avg: RecommendationAvgAggregateOutputType | null
    _sum: RecommendationSumAggregateOutputType | null
    _min: RecommendationMinAggregateOutputType | null
    _max: RecommendationMaxAggregateOutputType | null
  }

  export type RecommendationAvgAggregateOutputType = {
    confidence: Decimal | null
    expectedMarginMin: Decimal | null
    expectedMarginMax: Decimal | null
  }

  export type RecommendationSumAggregateOutputType = {
    confidence: Decimal | null
    expectedMarginMin: Decimal | null
    expectedMarginMax: Decimal | null
  }

  export type RecommendationMinAggregateOutputType = {
    id: string | null
    commodityId: string | null
    sourceRegion: string | null
    targetMarket: string | null
    action: $Enums.RecommendationAction | null
    confidence: Decimal | null
    expectedMarginMin: Decimal | null
    expectedMarginMax: Decimal | null
    validUntil: Date | null
    createdByAgent: string | null
    createdAt: Date | null
  }

  export type RecommendationMaxAggregateOutputType = {
    id: string | null
    commodityId: string | null
    sourceRegion: string | null
    targetMarket: string | null
    action: $Enums.RecommendationAction | null
    confidence: Decimal | null
    expectedMarginMin: Decimal | null
    expectedMarginMax: Decimal | null
    validUntil: Date | null
    createdByAgent: string | null
    createdAt: Date | null
  }

  export type RecommendationCountAggregateOutputType = {
    id: number
    commodityId: number
    sourceRegion: number
    targetMarket: number
    action: number
    confidence: number
    expectedMarginMin: number
    expectedMarginMax: number
    riskFlags: number
    assumptions: number
    payload: number
    validUntil: number
    createdByAgent: number
    createdAt: number
    _all: number
  }


  export type RecommendationAvgAggregateInputType = {
    confidence?: true
    expectedMarginMin?: true
    expectedMarginMax?: true
  }

  export type RecommendationSumAggregateInputType = {
    confidence?: true
    expectedMarginMin?: true
    expectedMarginMax?: true
  }

  export type RecommendationMinAggregateInputType = {
    id?: true
    commodityId?: true
    sourceRegion?: true
    targetMarket?: true
    action?: true
    confidence?: true
    expectedMarginMin?: true
    expectedMarginMax?: true
    validUntil?: true
    createdByAgent?: true
    createdAt?: true
  }

  export type RecommendationMaxAggregateInputType = {
    id?: true
    commodityId?: true
    sourceRegion?: true
    targetMarket?: true
    action?: true
    confidence?: true
    expectedMarginMin?: true
    expectedMarginMax?: true
    validUntil?: true
    createdByAgent?: true
    createdAt?: true
  }

  export type RecommendationCountAggregateInputType = {
    id?: true
    commodityId?: true
    sourceRegion?: true
    targetMarket?: true
    action?: true
    confidence?: true
    expectedMarginMin?: true
    expectedMarginMax?: true
    riskFlags?: true
    assumptions?: true
    payload?: true
    validUntil?: true
    createdByAgent?: true
    createdAt?: true
    _all?: true
  }

  export type RecommendationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recommendation to aggregate.
     */
    where?: RecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recommendations to fetch.
     */
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Recommendations
    **/
    _count?: true | RecommendationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecommendationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecommendationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecommendationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecommendationMaxAggregateInputType
  }

  export type GetRecommendationAggregateType<T extends RecommendationAggregateArgs> = {
        [P in keyof T & keyof AggregateRecommendation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecommendation[P]>
      : GetScalarType<T[P], AggregateRecommendation[P]>
  }




  export type RecommendationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationWhereInput
    orderBy?: RecommendationOrderByWithAggregationInput | RecommendationOrderByWithAggregationInput[]
    by: RecommendationScalarFieldEnum[] | RecommendationScalarFieldEnum
    having?: RecommendationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecommendationCountAggregateInputType | true
    _avg?: RecommendationAvgAggregateInputType
    _sum?: RecommendationSumAggregateInputType
    _min?: RecommendationMinAggregateInputType
    _max?: RecommendationMaxAggregateInputType
  }

  export type RecommendationGroupByOutputType = {
    id: string
    commodityId: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal
    expectedMarginMin: Decimal | null
    expectedMarginMax: Decimal | null
    riskFlags: JsonValue
    assumptions: JsonValue
    payload: JsonValue
    validUntil: Date
    createdByAgent: string
    createdAt: Date
    _count: RecommendationCountAggregateOutputType | null
    _avg: RecommendationAvgAggregateOutputType | null
    _sum: RecommendationSumAggregateOutputType | null
    _min: RecommendationMinAggregateOutputType | null
    _max: RecommendationMaxAggregateOutputType | null
  }

  type GetRecommendationGroupByPayload<T extends RecommendationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecommendationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecommendationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecommendationGroupByOutputType[P]>
            : GetScalarType<T[P], RecommendationGroupByOutputType[P]>
        }
      >
    >


  export type RecommendationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commodityId?: boolean
    sourceRegion?: boolean
    targetMarket?: boolean
    action?: boolean
    confidence?: boolean
    expectedMarginMin?: boolean
    expectedMarginMax?: boolean
    riskFlags?: boolean
    assumptions?: boolean
    payload?: boolean
    validUntil?: boolean
    createdByAgent?: boolean
    createdAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
    outcomes?: boolean | Recommendation$outcomesArgs<ExtArgs>
    _count?: boolean | RecommendationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendation"]>

  export type RecommendationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commodityId?: boolean
    sourceRegion?: boolean
    targetMarket?: boolean
    action?: boolean
    confidence?: boolean
    expectedMarginMin?: boolean
    expectedMarginMax?: boolean
    riskFlags?: boolean
    assumptions?: boolean
    payload?: boolean
    validUntil?: boolean
    createdByAgent?: boolean
    createdAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendation"]>

  export type RecommendationSelectScalar = {
    id?: boolean
    commodityId?: boolean
    sourceRegion?: boolean
    targetMarket?: boolean
    action?: boolean
    confidence?: boolean
    expectedMarginMin?: boolean
    expectedMarginMax?: boolean
    riskFlags?: boolean
    assumptions?: boolean
    payload?: boolean
    validUntil?: boolean
    createdByAgent?: boolean
    createdAt?: boolean
  }

  export type RecommendationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
    outcomes?: boolean | Recommendation$outcomesArgs<ExtArgs>
    _count?: boolean | RecommendationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RecommendationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }

  export type $RecommendationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Recommendation"
    objects: {
      commodity: Prisma.$CommodityPayload<ExtArgs>
      outcomes: Prisma.$RecommendationOutcomePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      commodityId: string
      sourceRegion: string
      targetMarket: string
      action: $Enums.RecommendationAction
      confidence: Prisma.Decimal
      expectedMarginMin: Prisma.Decimal | null
      expectedMarginMax: Prisma.Decimal | null
      riskFlags: Prisma.JsonValue
      assumptions: Prisma.JsonValue
      payload: Prisma.JsonValue
      validUntil: Date
      createdByAgent: string
      createdAt: Date
    }, ExtArgs["result"]["recommendation"]>
    composites: {}
  }

  type RecommendationGetPayload<S extends boolean | null | undefined | RecommendationDefaultArgs> = $Result.GetResult<Prisma.$RecommendationPayload, S>

  type RecommendationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RecommendationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RecommendationCountAggregateInputType | true
    }

  export interface RecommendationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Recommendation'], meta: { name: 'Recommendation' } }
    /**
     * Find zero or one Recommendation that matches the filter.
     * @param {RecommendationFindUniqueArgs} args - Arguments to find a Recommendation
     * @example
     * // Get one Recommendation
     * const recommendation = await prisma.recommendation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecommendationFindUniqueArgs>(args: SelectSubset<T, RecommendationFindUniqueArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Recommendation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RecommendationFindUniqueOrThrowArgs} args - Arguments to find a Recommendation
     * @example
     * // Get one Recommendation
     * const recommendation = await prisma.recommendation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecommendationFindUniqueOrThrowArgs>(args: SelectSubset<T, RecommendationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Recommendation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationFindFirstArgs} args - Arguments to find a Recommendation
     * @example
     * // Get one Recommendation
     * const recommendation = await prisma.recommendation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecommendationFindFirstArgs>(args?: SelectSubset<T, RecommendationFindFirstArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Recommendation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationFindFirstOrThrowArgs} args - Arguments to find a Recommendation
     * @example
     * // Get one Recommendation
     * const recommendation = await prisma.recommendation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecommendationFindFirstOrThrowArgs>(args?: SelectSubset<T, RecommendationFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Recommendations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recommendations
     * const recommendations = await prisma.recommendation.findMany()
     * 
     * // Get first 10 Recommendations
     * const recommendations = await prisma.recommendation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recommendationWithIdOnly = await prisma.recommendation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecommendationFindManyArgs>(args?: SelectSubset<T, RecommendationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Recommendation.
     * @param {RecommendationCreateArgs} args - Arguments to create a Recommendation.
     * @example
     * // Create one Recommendation
     * const Recommendation = await prisma.recommendation.create({
     *   data: {
     *     // ... data to create a Recommendation
     *   }
     * })
     * 
     */
    create<T extends RecommendationCreateArgs>(args: SelectSubset<T, RecommendationCreateArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Recommendations.
     * @param {RecommendationCreateManyArgs} args - Arguments to create many Recommendations.
     * @example
     * // Create many Recommendations
     * const recommendation = await prisma.recommendation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecommendationCreateManyArgs>(args?: SelectSubset<T, RecommendationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Recommendations and returns the data saved in the database.
     * @param {RecommendationCreateManyAndReturnArgs} args - Arguments to create many Recommendations.
     * @example
     * // Create many Recommendations
     * const recommendation = await prisma.recommendation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Recommendations and only return the `id`
     * const recommendationWithIdOnly = await prisma.recommendation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecommendationCreateManyAndReturnArgs>(args?: SelectSubset<T, RecommendationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Recommendation.
     * @param {RecommendationDeleteArgs} args - Arguments to delete one Recommendation.
     * @example
     * // Delete one Recommendation
     * const Recommendation = await prisma.recommendation.delete({
     *   where: {
     *     // ... filter to delete one Recommendation
     *   }
     * })
     * 
     */
    delete<T extends RecommendationDeleteArgs>(args: SelectSubset<T, RecommendationDeleteArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Recommendation.
     * @param {RecommendationUpdateArgs} args - Arguments to update one Recommendation.
     * @example
     * // Update one Recommendation
     * const recommendation = await prisma.recommendation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecommendationUpdateArgs>(args: SelectSubset<T, RecommendationUpdateArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Recommendations.
     * @param {RecommendationDeleteManyArgs} args - Arguments to filter Recommendations to delete.
     * @example
     * // Delete a few Recommendations
     * const { count } = await prisma.recommendation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecommendationDeleteManyArgs>(args?: SelectSubset<T, RecommendationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recommendations
     * const recommendation = await prisma.recommendation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecommendationUpdateManyArgs>(args: SelectSubset<T, RecommendationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Recommendation.
     * @param {RecommendationUpsertArgs} args - Arguments to update or create a Recommendation.
     * @example
     * // Update or create a Recommendation
     * const recommendation = await prisma.recommendation.upsert({
     *   create: {
     *     // ... data to create a Recommendation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recommendation we want to update
     *   }
     * })
     */
    upsert<T extends RecommendationUpsertArgs>(args: SelectSubset<T, RecommendationUpsertArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Recommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationCountArgs} args - Arguments to filter Recommendations to count.
     * @example
     * // Count the number of Recommendations
     * const count = await prisma.recommendation.count({
     *   where: {
     *     // ... the filter for the Recommendations we want to count
     *   }
     * })
    **/
    count<T extends RecommendationCountArgs>(
      args?: Subset<T, RecommendationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecommendationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Recommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecommendationAggregateArgs>(args: Subset<T, RecommendationAggregateArgs>): Prisma.PrismaPromise<GetRecommendationAggregateType<T>>

    /**
     * Group by Recommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecommendationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecommendationGroupByArgs['orderBy'] }
        : { orderBy?: RecommendationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecommendationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecommendationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Recommendation model
   */
  readonly fields: RecommendationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Recommendation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecommendationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    commodity<T extends CommodityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommodityDefaultArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    outcomes<T extends Recommendation$outcomesArgs<ExtArgs> = {}>(args?: Subset<T, Recommendation$outcomesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Recommendation model
   */ 
  interface RecommendationFieldRefs {
    readonly id: FieldRef<"Recommendation", 'String'>
    readonly commodityId: FieldRef<"Recommendation", 'String'>
    readonly sourceRegion: FieldRef<"Recommendation", 'String'>
    readonly targetMarket: FieldRef<"Recommendation", 'String'>
    readonly action: FieldRef<"Recommendation", 'RecommendationAction'>
    readonly confidence: FieldRef<"Recommendation", 'Decimal'>
    readonly expectedMarginMin: FieldRef<"Recommendation", 'Decimal'>
    readonly expectedMarginMax: FieldRef<"Recommendation", 'Decimal'>
    readonly riskFlags: FieldRef<"Recommendation", 'Json'>
    readonly assumptions: FieldRef<"Recommendation", 'Json'>
    readonly payload: FieldRef<"Recommendation", 'Json'>
    readonly validUntil: FieldRef<"Recommendation", 'DateTime'>
    readonly createdByAgent: FieldRef<"Recommendation", 'String'>
    readonly createdAt: FieldRef<"Recommendation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Recommendation findUnique
   */
  export type RecommendationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendation to fetch.
     */
    where: RecommendationWhereUniqueInput
  }

  /**
   * Recommendation findUniqueOrThrow
   */
  export type RecommendationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendation to fetch.
     */
    where: RecommendationWhereUniqueInput
  }

  /**
   * Recommendation findFirst
   */
  export type RecommendationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendation to fetch.
     */
    where?: RecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recommendations to fetch.
     */
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recommendations.
     */
    cursor?: RecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recommendations.
     */
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * Recommendation findFirstOrThrow
   */
  export type RecommendationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendation to fetch.
     */
    where?: RecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recommendations to fetch.
     */
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recommendations.
     */
    cursor?: RecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recommendations.
     */
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * Recommendation findMany
   */
  export type RecommendationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter, which Recommendations to fetch.
     */
    where?: RecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recommendations to fetch.
     */
    orderBy?: RecommendationOrderByWithRelationInput | RecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Recommendations.
     */
    cursor?: RecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recommendations.
     */
    skip?: number
    distinct?: RecommendationScalarFieldEnum | RecommendationScalarFieldEnum[]
  }

  /**
   * Recommendation create
   */
  export type RecommendationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * The data needed to create a Recommendation.
     */
    data: XOR<RecommendationCreateInput, RecommendationUncheckedCreateInput>
  }

  /**
   * Recommendation createMany
   */
  export type RecommendationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Recommendations.
     */
    data: RecommendationCreateManyInput | RecommendationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Recommendation createManyAndReturn
   */
  export type RecommendationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Recommendations.
     */
    data: RecommendationCreateManyInput | RecommendationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Recommendation update
   */
  export type RecommendationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * The data needed to update a Recommendation.
     */
    data: XOR<RecommendationUpdateInput, RecommendationUncheckedUpdateInput>
    /**
     * Choose, which Recommendation to update.
     */
    where: RecommendationWhereUniqueInput
  }

  /**
   * Recommendation updateMany
   */
  export type RecommendationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Recommendations.
     */
    data: XOR<RecommendationUpdateManyMutationInput, RecommendationUncheckedUpdateManyInput>
    /**
     * Filter which Recommendations to update
     */
    where?: RecommendationWhereInput
  }

  /**
   * Recommendation upsert
   */
  export type RecommendationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * The filter to search for the Recommendation to update in case it exists.
     */
    where: RecommendationWhereUniqueInput
    /**
     * In case the Recommendation found by the `where` argument doesn't exist, create a new Recommendation with this data.
     */
    create: XOR<RecommendationCreateInput, RecommendationUncheckedCreateInput>
    /**
     * In case the Recommendation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecommendationUpdateInput, RecommendationUncheckedUpdateInput>
  }

  /**
   * Recommendation delete
   */
  export type RecommendationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
    /**
     * Filter which Recommendation to delete.
     */
    where: RecommendationWhereUniqueInput
  }

  /**
   * Recommendation deleteMany
   */
  export type RecommendationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recommendations to delete
     */
    where?: RecommendationWhereInput
  }

  /**
   * Recommendation.outcomes
   */
  export type Recommendation$outcomesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    where?: RecommendationOutcomeWhereInput
    orderBy?: RecommendationOutcomeOrderByWithRelationInput | RecommendationOutcomeOrderByWithRelationInput[]
    cursor?: RecommendationOutcomeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecommendationOutcomeScalarFieldEnum | RecommendationOutcomeScalarFieldEnum[]
  }

  /**
   * Recommendation without action
   */
  export type RecommendationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recommendation
     */
    select?: RecommendationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationInclude<ExtArgs> | null
  }


  /**
   * Model WeatherSnapshot
   */

  export type AggregateWeatherSnapshot = {
    _count: WeatherSnapshotCountAggregateOutputType | null
    _avg: WeatherSnapshotAvgAggregateOutputType | null
    _sum: WeatherSnapshotSumAggregateOutputType | null
    _min: WeatherSnapshotMinAggregateOutputType | null
    _max: WeatherSnapshotMaxAggregateOutputType | null
  }

  export type WeatherSnapshotAvgAggregateOutputType = {
    maxTempC: Decimal | null
    minTempC: Decimal | null
    humidityPct: Decimal | null
    rainfallMm: Decimal | null
  }

  export type WeatherSnapshotSumAggregateOutputType = {
    maxTempC: Decimal | null
    minTempC: Decimal | null
    humidityPct: Decimal | null
    rainfallMm: Decimal | null
  }

  export type WeatherSnapshotMinAggregateOutputType = {
    id: string | null
    region: string | null
    forecastDate: Date | null
    maxTempC: Decimal | null
    minTempC: Decimal | null
    humidityPct: Decimal | null
    rainfallMm: Decimal | null
    riskLevel: $Enums.RiskLevel | null
    source: string | null
    createdAt: Date | null
  }

  export type WeatherSnapshotMaxAggregateOutputType = {
    id: string | null
    region: string | null
    forecastDate: Date | null
    maxTempC: Decimal | null
    minTempC: Decimal | null
    humidityPct: Decimal | null
    rainfallMm: Decimal | null
    riskLevel: $Enums.RiskLevel | null
    source: string | null
    createdAt: Date | null
  }

  export type WeatherSnapshotCountAggregateOutputType = {
    id: number
    region: number
    forecastDate: number
    maxTempC: number
    minTempC: number
    humidityPct: number
    rainfallMm: number
    riskLevel: number
    source: number
    createdAt: number
    _all: number
  }


  export type WeatherSnapshotAvgAggregateInputType = {
    maxTempC?: true
    minTempC?: true
    humidityPct?: true
    rainfallMm?: true
  }

  export type WeatherSnapshotSumAggregateInputType = {
    maxTempC?: true
    minTempC?: true
    humidityPct?: true
    rainfallMm?: true
  }

  export type WeatherSnapshotMinAggregateInputType = {
    id?: true
    region?: true
    forecastDate?: true
    maxTempC?: true
    minTempC?: true
    humidityPct?: true
    rainfallMm?: true
    riskLevel?: true
    source?: true
    createdAt?: true
  }

  export type WeatherSnapshotMaxAggregateInputType = {
    id?: true
    region?: true
    forecastDate?: true
    maxTempC?: true
    minTempC?: true
    humidityPct?: true
    rainfallMm?: true
    riskLevel?: true
    source?: true
    createdAt?: true
  }

  export type WeatherSnapshotCountAggregateInputType = {
    id?: true
    region?: true
    forecastDate?: true
    maxTempC?: true
    minTempC?: true
    humidityPct?: true
    rainfallMm?: true
    riskLevel?: true
    source?: true
    createdAt?: true
    _all?: true
  }

  export type WeatherSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeatherSnapshot to aggregate.
     */
    where?: WeatherSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeatherSnapshots to fetch.
     */
    orderBy?: WeatherSnapshotOrderByWithRelationInput | WeatherSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WeatherSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeatherSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeatherSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WeatherSnapshots
    **/
    _count?: true | WeatherSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WeatherSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WeatherSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WeatherSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WeatherSnapshotMaxAggregateInputType
  }

  export type GetWeatherSnapshotAggregateType<T extends WeatherSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateWeatherSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWeatherSnapshot[P]>
      : GetScalarType<T[P], AggregateWeatherSnapshot[P]>
  }




  export type WeatherSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WeatherSnapshotWhereInput
    orderBy?: WeatherSnapshotOrderByWithAggregationInput | WeatherSnapshotOrderByWithAggregationInput[]
    by: WeatherSnapshotScalarFieldEnum[] | WeatherSnapshotScalarFieldEnum
    having?: WeatherSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WeatherSnapshotCountAggregateInputType | true
    _avg?: WeatherSnapshotAvgAggregateInputType
    _sum?: WeatherSnapshotSumAggregateInputType
    _min?: WeatherSnapshotMinAggregateInputType
    _max?: WeatherSnapshotMaxAggregateInputType
  }

  export type WeatherSnapshotGroupByOutputType = {
    id: string
    region: string
    forecastDate: Date
    maxTempC: Decimal | null
    minTempC: Decimal | null
    humidityPct: Decimal | null
    rainfallMm: Decimal | null
    riskLevel: $Enums.RiskLevel
    source: string
    createdAt: Date
    _count: WeatherSnapshotCountAggregateOutputType | null
    _avg: WeatherSnapshotAvgAggregateOutputType | null
    _sum: WeatherSnapshotSumAggregateOutputType | null
    _min: WeatherSnapshotMinAggregateOutputType | null
    _max: WeatherSnapshotMaxAggregateOutputType | null
  }

  type GetWeatherSnapshotGroupByPayload<T extends WeatherSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WeatherSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WeatherSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WeatherSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], WeatherSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type WeatherSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    region?: boolean
    forecastDate?: boolean
    maxTempC?: boolean
    minTempC?: boolean
    humidityPct?: boolean
    rainfallMm?: boolean
    riskLevel?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["weatherSnapshot"]>

  export type WeatherSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    region?: boolean
    forecastDate?: boolean
    maxTempC?: boolean
    minTempC?: boolean
    humidityPct?: boolean
    rainfallMm?: boolean
    riskLevel?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["weatherSnapshot"]>

  export type WeatherSnapshotSelectScalar = {
    id?: boolean
    region?: boolean
    forecastDate?: boolean
    maxTempC?: boolean
    minTempC?: boolean
    humidityPct?: boolean
    rainfallMm?: boolean
    riskLevel?: boolean
    source?: boolean
    createdAt?: boolean
  }


  export type $WeatherSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WeatherSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      region: string
      forecastDate: Date
      maxTempC: Prisma.Decimal | null
      minTempC: Prisma.Decimal | null
      humidityPct: Prisma.Decimal | null
      rainfallMm: Prisma.Decimal | null
      riskLevel: $Enums.RiskLevel
      source: string
      createdAt: Date
    }, ExtArgs["result"]["weatherSnapshot"]>
    composites: {}
  }

  type WeatherSnapshotGetPayload<S extends boolean | null | undefined | WeatherSnapshotDefaultArgs> = $Result.GetResult<Prisma.$WeatherSnapshotPayload, S>

  type WeatherSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WeatherSnapshotFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WeatherSnapshotCountAggregateInputType | true
    }

  export interface WeatherSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WeatherSnapshot'], meta: { name: 'WeatherSnapshot' } }
    /**
     * Find zero or one WeatherSnapshot that matches the filter.
     * @param {WeatherSnapshotFindUniqueArgs} args - Arguments to find a WeatherSnapshot
     * @example
     * // Get one WeatherSnapshot
     * const weatherSnapshot = await prisma.weatherSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WeatherSnapshotFindUniqueArgs>(args: SelectSubset<T, WeatherSnapshotFindUniqueArgs<ExtArgs>>): Prisma__WeatherSnapshotClient<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one WeatherSnapshot that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WeatherSnapshotFindUniqueOrThrowArgs} args - Arguments to find a WeatherSnapshot
     * @example
     * // Get one WeatherSnapshot
     * const weatherSnapshot = await prisma.weatherSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WeatherSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, WeatherSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WeatherSnapshotClient<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first WeatherSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeatherSnapshotFindFirstArgs} args - Arguments to find a WeatherSnapshot
     * @example
     * // Get one WeatherSnapshot
     * const weatherSnapshot = await prisma.weatherSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WeatherSnapshotFindFirstArgs>(args?: SelectSubset<T, WeatherSnapshotFindFirstArgs<ExtArgs>>): Prisma__WeatherSnapshotClient<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first WeatherSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeatherSnapshotFindFirstOrThrowArgs} args - Arguments to find a WeatherSnapshot
     * @example
     * // Get one WeatherSnapshot
     * const weatherSnapshot = await prisma.weatherSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WeatherSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, WeatherSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__WeatherSnapshotClient<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more WeatherSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeatherSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WeatherSnapshots
     * const weatherSnapshots = await prisma.weatherSnapshot.findMany()
     * 
     * // Get first 10 WeatherSnapshots
     * const weatherSnapshots = await prisma.weatherSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const weatherSnapshotWithIdOnly = await prisma.weatherSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WeatherSnapshotFindManyArgs>(args?: SelectSubset<T, WeatherSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a WeatherSnapshot.
     * @param {WeatherSnapshotCreateArgs} args - Arguments to create a WeatherSnapshot.
     * @example
     * // Create one WeatherSnapshot
     * const WeatherSnapshot = await prisma.weatherSnapshot.create({
     *   data: {
     *     // ... data to create a WeatherSnapshot
     *   }
     * })
     * 
     */
    create<T extends WeatherSnapshotCreateArgs>(args: SelectSubset<T, WeatherSnapshotCreateArgs<ExtArgs>>): Prisma__WeatherSnapshotClient<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many WeatherSnapshots.
     * @param {WeatherSnapshotCreateManyArgs} args - Arguments to create many WeatherSnapshots.
     * @example
     * // Create many WeatherSnapshots
     * const weatherSnapshot = await prisma.weatherSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WeatherSnapshotCreateManyArgs>(args?: SelectSubset<T, WeatherSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WeatherSnapshots and returns the data saved in the database.
     * @param {WeatherSnapshotCreateManyAndReturnArgs} args - Arguments to create many WeatherSnapshots.
     * @example
     * // Create many WeatherSnapshots
     * const weatherSnapshot = await prisma.weatherSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WeatherSnapshots and only return the `id`
     * const weatherSnapshotWithIdOnly = await prisma.weatherSnapshot.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WeatherSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, WeatherSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a WeatherSnapshot.
     * @param {WeatherSnapshotDeleteArgs} args - Arguments to delete one WeatherSnapshot.
     * @example
     * // Delete one WeatherSnapshot
     * const WeatherSnapshot = await prisma.weatherSnapshot.delete({
     *   where: {
     *     // ... filter to delete one WeatherSnapshot
     *   }
     * })
     * 
     */
    delete<T extends WeatherSnapshotDeleteArgs>(args: SelectSubset<T, WeatherSnapshotDeleteArgs<ExtArgs>>): Prisma__WeatherSnapshotClient<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one WeatherSnapshot.
     * @param {WeatherSnapshotUpdateArgs} args - Arguments to update one WeatherSnapshot.
     * @example
     * // Update one WeatherSnapshot
     * const weatherSnapshot = await prisma.weatherSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WeatherSnapshotUpdateArgs>(args: SelectSubset<T, WeatherSnapshotUpdateArgs<ExtArgs>>): Prisma__WeatherSnapshotClient<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more WeatherSnapshots.
     * @param {WeatherSnapshotDeleteManyArgs} args - Arguments to filter WeatherSnapshots to delete.
     * @example
     * // Delete a few WeatherSnapshots
     * const { count } = await prisma.weatherSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WeatherSnapshotDeleteManyArgs>(args?: SelectSubset<T, WeatherSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WeatherSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeatherSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WeatherSnapshots
     * const weatherSnapshot = await prisma.weatherSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WeatherSnapshotUpdateManyArgs>(args: SelectSubset<T, WeatherSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one WeatherSnapshot.
     * @param {WeatherSnapshotUpsertArgs} args - Arguments to update or create a WeatherSnapshot.
     * @example
     * // Update or create a WeatherSnapshot
     * const weatherSnapshot = await prisma.weatherSnapshot.upsert({
     *   create: {
     *     // ... data to create a WeatherSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WeatherSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends WeatherSnapshotUpsertArgs>(args: SelectSubset<T, WeatherSnapshotUpsertArgs<ExtArgs>>): Prisma__WeatherSnapshotClient<$Result.GetResult<Prisma.$WeatherSnapshotPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of WeatherSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeatherSnapshotCountArgs} args - Arguments to filter WeatherSnapshots to count.
     * @example
     * // Count the number of WeatherSnapshots
     * const count = await prisma.weatherSnapshot.count({
     *   where: {
     *     // ... the filter for the WeatherSnapshots we want to count
     *   }
     * })
    **/
    count<T extends WeatherSnapshotCountArgs>(
      args?: Subset<T, WeatherSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WeatherSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WeatherSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeatherSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WeatherSnapshotAggregateArgs>(args: Subset<T, WeatherSnapshotAggregateArgs>): Prisma.PrismaPromise<GetWeatherSnapshotAggregateType<T>>

    /**
     * Group by WeatherSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WeatherSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WeatherSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WeatherSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: WeatherSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WeatherSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeatherSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WeatherSnapshot model
   */
  readonly fields: WeatherSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WeatherSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WeatherSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WeatherSnapshot model
   */ 
  interface WeatherSnapshotFieldRefs {
    readonly id: FieldRef<"WeatherSnapshot", 'String'>
    readonly region: FieldRef<"WeatherSnapshot", 'String'>
    readonly forecastDate: FieldRef<"WeatherSnapshot", 'DateTime'>
    readonly maxTempC: FieldRef<"WeatherSnapshot", 'Decimal'>
    readonly minTempC: FieldRef<"WeatherSnapshot", 'Decimal'>
    readonly humidityPct: FieldRef<"WeatherSnapshot", 'Decimal'>
    readonly rainfallMm: FieldRef<"WeatherSnapshot", 'Decimal'>
    readonly riskLevel: FieldRef<"WeatherSnapshot", 'RiskLevel'>
    readonly source: FieldRef<"WeatherSnapshot", 'String'>
    readonly createdAt: FieldRef<"WeatherSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WeatherSnapshot findUnique
   */
  export type WeatherSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which WeatherSnapshot to fetch.
     */
    where: WeatherSnapshotWhereUniqueInput
  }

  /**
   * WeatherSnapshot findUniqueOrThrow
   */
  export type WeatherSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which WeatherSnapshot to fetch.
     */
    where: WeatherSnapshotWhereUniqueInput
  }

  /**
   * WeatherSnapshot findFirst
   */
  export type WeatherSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which WeatherSnapshot to fetch.
     */
    where?: WeatherSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeatherSnapshots to fetch.
     */
    orderBy?: WeatherSnapshotOrderByWithRelationInput | WeatherSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeatherSnapshots.
     */
    cursor?: WeatherSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeatherSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeatherSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeatherSnapshots.
     */
    distinct?: WeatherSnapshotScalarFieldEnum | WeatherSnapshotScalarFieldEnum[]
  }

  /**
   * WeatherSnapshot findFirstOrThrow
   */
  export type WeatherSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which WeatherSnapshot to fetch.
     */
    where?: WeatherSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeatherSnapshots to fetch.
     */
    orderBy?: WeatherSnapshotOrderByWithRelationInput | WeatherSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WeatherSnapshots.
     */
    cursor?: WeatherSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeatherSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeatherSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WeatherSnapshots.
     */
    distinct?: WeatherSnapshotScalarFieldEnum | WeatherSnapshotScalarFieldEnum[]
  }

  /**
   * WeatherSnapshot findMany
   */
  export type WeatherSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which WeatherSnapshots to fetch.
     */
    where?: WeatherSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WeatherSnapshots to fetch.
     */
    orderBy?: WeatherSnapshotOrderByWithRelationInput | WeatherSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WeatherSnapshots.
     */
    cursor?: WeatherSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WeatherSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WeatherSnapshots.
     */
    skip?: number
    distinct?: WeatherSnapshotScalarFieldEnum | WeatherSnapshotScalarFieldEnum[]
  }

  /**
   * WeatherSnapshot create
   */
  export type WeatherSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * The data needed to create a WeatherSnapshot.
     */
    data: XOR<WeatherSnapshotCreateInput, WeatherSnapshotUncheckedCreateInput>
  }

  /**
   * WeatherSnapshot createMany
   */
  export type WeatherSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WeatherSnapshots.
     */
    data: WeatherSnapshotCreateManyInput | WeatherSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeatherSnapshot createManyAndReturn
   */
  export type WeatherSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many WeatherSnapshots.
     */
    data: WeatherSnapshotCreateManyInput | WeatherSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WeatherSnapshot update
   */
  export type WeatherSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * The data needed to update a WeatherSnapshot.
     */
    data: XOR<WeatherSnapshotUpdateInput, WeatherSnapshotUncheckedUpdateInput>
    /**
     * Choose, which WeatherSnapshot to update.
     */
    where: WeatherSnapshotWhereUniqueInput
  }

  /**
   * WeatherSnapshot updateMany
   */
  export type WeatherSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WeatherSnapshots.
     */
    data: XOR<WeatherSnapshotUpdateManyMutationInput, WeatherSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which WeatherSnapshots to update
     */
    where?: WeatherSnapshotWhereInput
  }

  /**
   * WeatherSnapshot upsert
   */
  export type WeatherSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * The filter to search for the WeatherSnapshot to update in case it exists.
     */
    where: WeatherSnapshotWhereUniqueInput
    /**
     * In case the WeatherSnapshot found by the `where` argument doesn't exist, create a new WeatherSnapshot with this data.
     */
    create: XOR<WeatherSnapshotCreateInput, WeatherSnapshotUncheckedCreateInput>
    /**
     * In case the WeatherSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WeatherSnapshotUpdateInput, WeatherSnapshotUncheckedUpdateInput>
  }

  /**
   * WeatherSnapshot delete
   */
  export type WeatherSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
    /**
     * Filter which WeatherSnapshot to delete.
     */
    where: WeatherSnapshotWhereUniqueInput
  }

  /**
   * WeatherSnapshot deleteMany
   */
  export type WeatherSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WeatherSnapshots to delete
     */
    where?: WeatherSnapshotWhereInput
  }

  /**
   * WeatherSnapshot without action
   */
  export type WeatherSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WeatherSnapshot
     */
    select?: WeatherSnapshotSelect<ExtArgs> | null
  }


  /**
   * Model QualitySpec
   */

  export type AggregateQualitySpec = {
    _count: QualitySpecCountAggregateOutputType | null
    _min: QualitySpecMinAggregateOutputType | null
    _max: QualitySpecMaxAggregateOutputType | null
  }

  export type QualitySpecMinAggregateOutputType = {
    id: string | null
    commodityId: string | null
    grade: string | null
    parameter: string | null
    minValue: string | null
    maxValue: string | null
    checklistNote: string | null
    createdAt: Date | null
  }

  export type QualitySpecMaxAggregateOutputType = {
    id: string | null
    commodityId: string | null
    grade: string | null
    parameter: string | null
    minValue: string | null
    maxValue: string | null
    checklistNote: string | null
    createdAt: Date | null
  }

  export type QualitySpecCountAggregateOutputType = {
    id: number
    commodityId: number
    grade: number
    parameter: number
    minValue: number
    maxValue: number
    checklistNote: number
    createdAt: number
    _all: number
  }


  export type QualitySpecMinAggregateInputType = {
    id?: true
    commodityId?: true
    grade?: true
    parameter?: true
    minValue?: true
    maxValue?: true
    checklistNote?: true
    createdAt?: true
  }

  export type QualitySpecMaxAggregateInputType = {
    id?: true
    commodityId?: true
    grade?: true
    parameter?: true
    minValue?: true
    maxValue?: true
    checklistNote?: true
    createdAt?: true
  }

  export type QualitySpecCountAggregateInputType = {
    id?: true
    commodityId?: true
    grade?: true
    parameter?: true
    minValue?: true
    maxValue?: true
    checklistNote?: true
    createdAt?: true
    _all?: true
  }

  export type QualitySpecAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QualitySpec to aggregate.
     */
    where?: QualitySpecWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QualitySpecs to fetch.
     */
    orderBy?: QualitySpecOrderByWithRelationInput | QualitySpecOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QualitySpecWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QualitySpecs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QualitySpecs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QualitySpecs
    **/
    _count?: true | QualitySpecCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QualitySpecMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QualitySpecMaxAggregateInputType
  }

  export type GetQualitySpecAggregateType<T extends QualitySpecAggregateArgs> = {
        [P in keyof T & keyof AggregateQualitySpec]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQualitySpec[P]>
      : GetScalarType<T[P], AggregateQualitySpec[P]>
  }




  export type QualitySpecGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QualitySpecWhereInput
    orderBy?: QualitySpecOrderByWithAggregationInput | QualitySpecOrderByWithAggregationInput[]
    by: QualitySpecScalarFieldEnum[] | QualitySpecScalarFieldEnum
    having?: QualitySpecScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QualitySpecCountAggregateInputType | true
    _min?: QualitySpecMinAggregateInputType
    _max?: QualitySpecMaxAggregateInputType
  }

  export type QualitySpecGroupByOutputType = {
    id: string
    commodityId: string
    grade: string
    parameter: string
    minValue: string | null
    maxValue: string | null
    checklistNote: string | null
    createdAt: Date
    _count: QualitySpecCountAggregateOutputType | null
    _min: QualitySpecMinAggregateOutputType | null
    _max: QualitySpecMaxAggregateOutputType | null
  }

  type GetQualitySpecGroupByPayload<T extends QualitySpecGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QualitySpecGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QualitySpecGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QualitySpecGroupByOutputType[P]>
            : GetScalarType<T[P], QualitySpecGroupByOutputType[P]>
        }
      >
    >


  export type QualitySpecSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commodityId?: boolean
    grade?: boolean
    parameter?: boolean
    minValue?: boolean
    maxValue?: boolean
    checklistNote?: boolean
    createdAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["qualitySpec"]>

  export type QualitySpecSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commodityId?: boolean
    grade?: boolean
    parameter?: boolean
    minValue?: boolean
    maxValue?: boolean
    checklistNote?: boolean
    createdAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["qualitySpec"]>

  export type QualitySpecSelectScalar = {
    id?: boolean
    commodityId?: boolean
    grade?: boolean
    parameter?: boolean
    minValue?: boolean
    maxValue?: boolean
    checklistNote?: boolean
    createdAt?: boolean
  }

  export type QualitySpecInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }
  export type QualitySpecIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }

  export type $QualitySpecPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QualitySpec"
    objects: {
      commodity: Prisma.$CommodityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      commodityId: string
      grade: string
      parameter: string
      minValue: string | null
      maxValue: string | null
      checklistNote: string | null
      createdAt: Date
    }, ExtArgs["result"]["qualitySpec"]>
    composites: {}
  }

  type QualitySpecGetPayload<S extends boolean | null | undefined | QualitySpecDefaultArgs> = $Result.GetResult<Prisma.$QualitySpecPayload, S>

  type QualitySpecCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QualitySpecFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QualitySpecCountAggregateInputType | true
    }

  export interface QualitySpecDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QualitySpec'], meta: { name: 'QualitySpec' } }
    /**
     * Find zero or one QualitySpec that matches the filter.
     * @param {QualitySpecFindUniqueArgs} args - Arguments to find a QualitySpec
     * @example
     * // Get one QualitySpec
     * const qualitySpec = await prisma.qualitySpec.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QualitySpecFindUniqueArgs>(args: SelectSubset<T, QualitySpecFindUniqueArgs<ExtArgs>>): Prisma__QualitySpecClient<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QualitySpec that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QualitySpecFindUniqueOrThrowArgs} args - Arguments to find a QualitySpec
     * @example
     * // Get one QualitySpec
     * const qualitySpec = await prisma.qualitySpec.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QualitySpecFindUniqueOrThrowArgs>(args: SelectSubset<T, QualitySpecFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QualitySpecClient<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QualitySpec that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualitySpecFindFirstArgs} args - Arguments to find a QualitySpec
     * @example
     * // Get one QualitySpec
     * const qualitySpec = await prisma.qualitySpec.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QualitySpecFindFirstArgs>(args?: SelectSubset<T, QualitySpecFindFirstArgs<ExtArgs>>): Prisma__QualitySpecClient<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QualitySpec that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualitySpecFindFirstOrThrowArgs} args - Arguments to find a QualitySpec
     * @example
     * // Get one QualitySpec
     * const qualitySpec = await prisma.qualitySpec.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QualitySpecFindFirstOrThrowArgs>(args?: SelectSubset<T, QualitySpecFindFirstOrThrowArgs<ExtArgs>>): Prisma__QualitySpecClient<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QualitySpecs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualitySpecFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QualitySpecs
     * const qualitySpecs = await prisma.qualitySpec.findMany()
     * 
     * // Get first 10 QualitySpecs
     * const qualitySpecs = await prisma.qualitySpec.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qualitySpecWithIdOnly = await prisma.qualitySpec.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QualitySpecFindManyArgs>(args?: SelectSubset<T, QualitySpecFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QualitySpec.
     * @param {QualitySpecCreateArgs} args - Arguments to create a QualitySpec.
     * @example
     * // Create one QualitySpec
     * const QualitySpec = await prisma.qualitySpec.create({
     *   data: {
     *     // ... data to create a QualitySpec
     *   }
     * })
     * 
     */
    create<T extends QualitySpecCreateArgs>(args: SelectSubset<T, QualitySpecCreateArgs<ExtArgs>>): Prisma__QualitySpecClient<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QualitySpecs.
     * @param {QualitySpecCreateManyArgs} args - Arguments to create many QualitySpecs.
     * @example
     * // Create many QualitySpecs
     * const qualitySpec = await prisma.qualitySpec.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QualitySpecCreateManyArgs>(args?: SelectSubset<T, QualitySpecCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QualitySpecs and returns the data saved in the database.
     * @param {QualitySpecCreateManyAndReturnArgs} args - Arguments to create many QualitySpecs.
     * @example
     * // Create many QualitySpecs
     * const qualitySpec = await prisma.qualitySpec.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QualitySpecs and only return the `id`
     * const qualitySpecWithIdOnly = await prisma.qualitySpec.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QualitySpecCreateManyAndReturnArgs>(args?: SelectSubset<T, QualitySpecCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QualitySpec.
     * @param {QualitySpecDeleteArgs} args - Arguments to delete one QualitySpec.
     * @example
     * // Delete one QualitySpec
     * const QualitySpec = await prisma.qualitySpec.delete({
     *   where: {
     *     // ... filter to delete one QualitySpec
     *   }
     * })
     * 
     */
    delete<T extends QualitySpecDeleteArgs>(args: SelectSubset<T, QualitySpecDeleteArgs<ExtArgs>>): Prisma__QualitySpecClient<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QualitySpec.
     * @param {QualitySpecUpdateArgs} args - Arguments to update one QualitySpec.
     * @example
     * // Update one QualitySpec
     * const qualitySpec = await prisma.qualitySpec.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QualitySpecUpdateArgs>(args: SelectSubset<T, QualitySpecUpdateArgs<ExtArgs>>): Prisma__QualitySpecClient<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QualitySpecs.
     * @param {QualitySpecDeleteManyArgs} args - Arguments to filter QualitySpecs to delete.
     * @example
     * // Delete a few QualitySpecs
     * const { count } = await prisma.qualitySpec.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QualitySpecDeleteManyArgs>(args?: SelectSubset<T, QualitySpecDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QualitySpecs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualitySpecUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QualitySpecs
     * const qualitySpec = await prisma.qualitySpec.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QualitySpecUpdateManyArgs>(args: SelectSubset<T, QualitySpecUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QualitySpec.
     * @param {QualitySpecUpsertArgs} args - Arguments to update or create a QualitySpec.
     * @example
     * // Update or create a QualitySpec
     * const qualitySpec = await prisma.qualitySpec.upsert({
     *   create: {
     *     // ... data to create a QualitySpec
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QualitySpec we want to update
     *   }
     * })
     */
    upsert<T extends QualitySpecUpsertArgs>(args: SelectSubset<T, QualitySpecUpsertArgs<ExtArgs>>): Prisma__QualitySpecClient<$Result.GetResult<Prisma.$QualitySpecPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QualitySpecs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualitySpecCountArgs} args - Arguments to filter QualitySpecs to count.
     * @example
     * // Count the number of QualitySpecs
     * const count = await prisma.qualitySpec.count({
     *   where: {
     *     // ... the filter for the QualitySpecs we want to count
     *   }
     * })
    **/
    count<T extends QualitySpecCountArgs>(
      args?: Subset<T, QualitySpecCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QualitySpecCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QualitySpec.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualitySpecAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QualitySpecAggregateArgs>(args: Subset<T, QualitySpecAggregateArgs>): Prisma.PrismaPromise<GetQualitySpecAggregateType<T>>

    /**
     * Group by QualitySpec.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualitySpecGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QualitySpecGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QualitySpecGroupByArgs['orderBy'] }
        : { orderBy?: QualitySpecGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QualitySpecGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQualitySpecGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QualitySpec model
   */
  readonly fields: QualitySpecFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QualitySpec.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QualitySpecClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    commodity<T extends CommodityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommodityDefaultArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QualitySpec model
   */ 
  interface QualitySpecFieldRefs {
    readonly id: FieldRef<"QualitySpec", 'String'>
    readonly commodityId: FieldRef<"QualitySpec", 'String'>
    readonly grade: FieldRef<"QualitySpec", 'String'>
    readonly parameter: FieldRef<"QualitySpec", 'String'>
    readonly minValue: FieldRef<"QualitySpec", 'String'>
    readonly maxValue: FieldRef<"QualitySpec", 'String'>
    readonly checklistNote: FieldRef<"QualitySpec", 'String'>
    readonly createdAt: FieldRef<"QualitySpec", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QualitySpec findUnique
   */
  export type QualitySpecFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * Filter, which QualitySpec to fetch.
     */
    where: QualitySpecWhereUniqueInput
  }

  /**
   * QualitySpec findUniqueOrThrow
   */
  export type QualitySpecFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * Filter, which QualitySpec to fetch.
     */
    where: QualitySpecWhereUniqueInput
  }

  /**
   * QualitySpec findFirst
   */
  export type QualitySpecFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * Filter, which QualitySpec to fetch.
     */
    where?: QualitySpecWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QualitySpecs to fetch.
     */
    orderBy?: QualitySpecOrderByWithRelationInput | QualitySpecOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QualitySpecs.
     */
    cursor?: QualitySpecWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QualitySpecs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QualitySpecs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QualitySpecs.
     */
    distinct?: QualitySpecScalarFieldEnum | QualitySpecScalarFieldEnum[]
  }

  /**
   * QualitySpec findFirstOrThrow
   */
  export type QualitySpecFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * Filter, which QualitySpec to fetch.
     */
    where?: QualitySpecWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QualitySpecs to fetch.
     */
    orderBy?: QualitySpecOrderByWithRelationInput | QualitySpecOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QualitySpecs.
     */
    cursor?: QualitySpecWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QualitySpecs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QualitySpecs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QualitySpecs.
     */
    distinct?: QualitySpecScalarFieldEnum | QualitySpecScalarFieldEnum[]
  }

  /**
   * QualitySpec findMany
   */
  export type QualitySpecFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * Filter, which QualitySpecs to fetch.
     */
    where?: QualitySpecWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QualitySpecs to fetch.
     */
    orderBy?: QualitySpecOrderByWithRelationInput | QualitySpecOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QualitySpecs.
     */
    cursor?: QualitySpecWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QualitySpecs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QualitySpecs.
     */
    skip?: number
    distinct?: QualitySpecScalarFieldEnum | QualitySpecScalarFieldEnum[]
  }

  /**
   * QualitySpec create
   */
  export type QualitySpecCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * The data needed to create a QualitySpec.
     */
    data: XOR<QualitySpecCreateInput, QualitySpecUncheckedCreateInput>
  }

  /**
   * QualitySpec createMany
   */
  export type QualitySpecCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QualitySpecs.
     */
    data: QualitySpecCreateManyInput | QualitySpecCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QualitySpec createManyAndReturn
   */
  export type QualitySpecCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QualitySpecs.
     */
    data: QualitySpecCreateManyInput | QualitySpecCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QualitySpec update
   */
  export type QualitySpecUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * The data needed to update a QualitySpec.
     */
    data: XOR<QualitySpecUpdateInput, QualitySpecUncheckedUpdateInput>
    /**
     * Choose, which QualitySpec to update.
     */
    where: QualitySpecWhereUniqueInput
  }

  /**
   * QualitySpec updateMany
   */
  export type QualitySpecUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QualitySpecs.
     */
    data: XOR<QualitySpecUpdateManyMutationInput, QualitySpecUncheckedUpdateManyInput>
    /**
     * Filter which QualitySpecs to update
     */
    where?: QualitySpecWhereInput
  }

  /**
   * QualitySpec upsert
   */
  export type QualitySpecUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * The filter to search for the QualitySpec to update in case it exists.
     */
    where: QualitySpecWhereUniqueInput
    /**
     * In case the QualitySpec found by the `where` argument doesn't exist, create a new QualitySpec with this data.
     */
    create: XOR<QualitySpecCreateInput, QualitySpecUncheckedCreateInput>
    /**
     * In case the QualitySpec was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QualitySpecUpdateInput, QualitySpecUncheckedUpdateInput>
  }

  /**
   * QualitySpec delete
   */
  export type QualitySpecDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
    /**
     * Filter which QualitySpec to delete.
     */
    where: QualitySpecWhereUniqueInput
  }

  /**
   * QualitySpec deleteMany
   */
  export type QualitySpecDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QualitySpecs to delete
     */
    where?: QualitySpecWhereInput
  }

  /**
   * QualitySpec without action
   */
  export type QualitySpecDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualitySpec
     */
    select?: QualitySpecSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualitySpecInclude<ExtArgs> | null
  }


  /**
   * Model StorageProfile
   */

  export type AggregateStorageProfile = {
    _count: StorageProfileCountAggregateOutputType | null
    _avg: StorageProfileAvgAggregateOutputType | null
    _sum: StorageProfileSumAggregateOutputType | null
    _min: StorageProfileMinAggregateOutputType | null
    _max: StorageProfileMaxAggregateOutputType | null
  }

  export type StorageProfileAvgAggregateOutputType = {
    maxDays: number | null
  }

  export type StorageProfileSumAggregateOutputType = {
    maxDays: number | null
  }

  export type StorageProfileMinAggregateOutputType = {
    id: string | null
    commodityId: string | null
    mode: $Enums.StorageMode | null
    tempRange: string | null
    humidityRange: string | null
    maxDays: number | null
    spoilageRiskNote: string | null
    createdAt: Date | null
  }

  export type StorageProfileMaxAggregateOutputType = {
    id: string | null
    commodityId: string | null
    mode: $Enums.StorageMode | null
    tempRange: string | null
    humidityRange: string | null
    maxDays: number | null
    spoilageRiskNote: string | null
    createdAt: Date | null
  }

  export type StorageProfileCountAggregateOutputType = {
    id: number
    commodityId: number
    mode: number
    tempRange: number
    humidityRange: number
    maxDays: number
    spoilageRiskNote: number
    createdAt: number
    _all: number
  }


  export type StorageProfileAvgAggregateInputType = {
    maxDays?: true
  }

  export type StorageProfileSumAggregateInputType = {
    maxDays?: true
  }

  export type StorageProfileMinAggregateInputType = {
    id?: true
    commodityId?: true
    mode?: true
    tempRange?: true
    humidityRange?: true
    maxDays?: true
    spoilageRiskNote?: true
    createdAt?: true
  }

  export type StorageProfileMaxAggregateInputType = {
    id?: true
    commodityId?: true
    mode?: true
    tempRange?: true
    humidityRange?: true
    maxDays?: true
    spoilageRiskNote?: true
    createdAt?: true
  }

  export type StorageProfileCountAggregateInputType = {
    id?: true
    commodityId?: true
    mode?: true
    tempRange?: true
    humidityRange?: true
    maxDays?: true
    spoilageRiskNote?: true
    createdAt?: true
    _all?: true
  }

  export type StorageProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageProfile to aggregate.
     */
    where?: StorageProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageProfiles to fetch.
     */
    orderBy?: StorageProfileOrderByWithRelationInput | StorageProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StorageProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StorageProfiles
    **/
    _count?: true | StorageProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StorageProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StorageProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StorageProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StorageProfileMaxAggregateInputType
  }

  export type GetStorageProfileAggregateType<T extends StorageProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateStorageProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStorageProfile[P]>
      : GetScalarType<T[P], AggregateStorageProfile[P]>
  }




  export type StorageProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StorageProfileWhereInput
    orderBy?: StorageProfileOrderByWithAggregationInput | StorageProfileOrderByWithAggregationInput[]
    by: StorageProfileScalarFieldEnum[] | StorageProfileScalarFieldEnum
    having?: StorageProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StorageProfileCountAggregateInputType | true
    _avg?: StorageProfileAvgAggregateInputType
    _sum?: StorageProfileSumAggregateInputType
    _min?: StorageProfileMinAggregateInputType
    _max?: StorageProfileMaxAggregateInputType
  }

  export type StorageProfileGroupByOutputType = {
    id: string
    commodityId: string
    mode: $Enums.StorageMode
    tempRange: string | null
    humidityRange: string | null
    maxDays: number
    spoilageRiskNote: string | null
    createdAt: Date
    _count: StorageProfileCountAggregateOutputType | null
    _avg: StorageProfileAvgAggregateOutputType | null
    _sum: StorageProfileSumAggregateOutputType | null
    _min: StorageProfileMinAggregateOutputType | null
    _max: StorageProfileMaxAggregateOutputType | null
  }

  type GetStorageProfileGroupByPayload<T extends StorageProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StorageProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StorageProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StorageProfileGroupByOutputType[P]>
            : GetScalarType<T[P], StorageProfileGroupByOutputType[P]>
        }
      >
    >


  export type StorageProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commodityId?: boolean
    mode?: boolean
    tempRange?: boolean
    humidityRange?: boolean
    maxDays?: boolean
    spoilageRiskNote?: boolean
    createdAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storageProfile"]>

  export type StorageProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commodityId?: boolean
    mode?: boolean
    tempRange?: boolean
    humidityRange?: boolean
    maxDays?: boolean
    spoilageRiskNote?: boolean
    createdAt?: boolean
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storageProfile"]>

  export type StorageProfileSelectScalar = {
    id?: boolean
    commodityId?: boolean
    mode?: boolean
    tempRange?: boolean
    humidityRange?: boolean
    maxDays?: boolean
    spoilageRiskNote?: boolean
    createdAt?: boolean
  }

  export type StorageProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }
  export type StorageProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commodity?: boolean | CommodityDefaultArgs<ExtArgs>
  }

  export type $StorageProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StorageProfile"
    objects: {
      commodity: Prisma.$CommodityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      commodityId: string
      mode: $Enums.StorageMode
      tempRange: string | null
      humidityRange: string | null
      maxDays: number
      spoilageRiskNote: string | null
      createdAt: Date
    }, ExtArgs["result"]["storageProfile"]>
    composites: {}
  }

  type StorageProfileGetPayload<S extends boolean | null | undefined | StorageProfileDefaultArgs> = $Result.GetResult<Prisma.$StorageProfilePayload, S>

  type StorageProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StorageProfileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StorageProfileCountAggregateInputType | true
    }

  export interface StorageProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StorageProfile'], meta: { name: 'StorageProfile' } }
    /**
     * Find zero or one StorageProfile that matches the filter.
     * @param {StorageProfileFindUniqueArgs} args - Arguments to find a StorageProfile
     * @example
     * // Get one StorageProfile
     * const storageProfile = await prisma.storageProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StorageProfileFindUniqueArgs>(args: SelectSubset<T, StorageProfileFindUniqueArgs<ExtArgs>>): Prisma__StorageProfileClient<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StorageProfile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StorageProfileFindUniqueOrThrowArgs} args - Arguments to find a StorageProfile
     * @example
     * // Get one StorageProfile
     * const storageProfile = await prisma.storageProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StorageProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, StorageProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StorageProfileClient<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StorageProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageProfileFindFirstArgs} args - Arguments to find a StorageProfile
     * @example
     * // Get one StorageProfile
     * const storageProfile = await prisma.storageProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StorageProfileFindFirstArgs>(args?: SelectSubset<T, StorageProfileFindFirstArgs<ExtArgs>>): Prisma__StorageProfileClient<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StorageProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageProfileFindFirstOrThrowArgs} args - Arguments to find a StorageProfile
     * @example
     * // Get one StorageProfile
     * const storageProfile = await prisma.storageProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StorageProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, StorageProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__StorageProfileClient<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StorageProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StorageProfiles
     * const storageProfiles = await prisma.storageProfile.findMany()
     * 
     * // Get first 10 StorageProfiles
     * const storageProfiles = await prisma.storageProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storageProfileWithIdOnly = await prisma.storageProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StorageProfileFindManyArgs>(args?: SelectSubset<T, StorageProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StorageProfile.
     * @param {StorageProfileCreateArgs} args - Arguments to create a StorageProfile.
     * @example
     * // Create one StorageProfile
     * const StorageProfile = await prisma.storageProfile.create({
     *   data: {
     *     // ... data to create a StorageProfile
     *   }
     * })
     * 
     */
    create<T extends StorageProfileCreateArgs>(args: SelectSubset<T, StorageProfileCreateArgs<ExtArgs>>): Prisma__StorageProfileClient<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StorageProfiles.
     * @param {StorageProfileCreateManyArgs} args - Arguments to create many StorageProfiles.
     * @example
     * // Create many StorageProfiles
     * const storageProfile = await prisma.storageProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StorageProfileCreateManyArgs>(args?: SelectSubset<T, StorageProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StorageProfiles and returns the data saved in the database.
     * @param {StorageProfileCreateManyAndReturnArgs} args - Arguments to create many StorageProfiles.
     * @example
     * // Create many StorageProfiles
     * const storageProfile = await prisma.storageProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StorageProfiles and only return the `id`
     * const storageProfileWithIdOnly = await prisma.storageProfile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StorageProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, StorageProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StorageProfile.
     * @param {StorageProfileDeleteArgs} args - Arguments to delete one StorageProfile.
     * @example
     * // Delete one StorageProfile
     * const StorageProfile = await prisma.storageProfile.delete({
     *   where: {
     *     // ... filter to delete one StorageProfile
     *   }
     * })
     * 
     */
    delete<T extends StorageProfileDeleteArgs>(args: SelectSubset<T, StorageProfileDeleteArgs<ExtArgs>>): Prisma__StorageProfileClient<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StorageProfile.
     * @param {StorageProfileUpdateArgs} args - Arguments to update one StorageProfile.
     * @example
     * // Update one StorageProfile
     * const storageProfile = await prisma.storageProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StorageProfileUpdateArgs>(args: SelectSubset<T, StorageProfileUpdateArgs<ExtArgs>>): Prisma__StorageProfileClient<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StorageProfiles.
     * @param {StorageProfileDeleteManyArgs} args - Arguments to filter StorageProfiles to delete.
     * @example
     * // Delete a few StorageProfiles
     * const { count } = await prisma.storageProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StorageProfileDeleteManyArgs>(args?: SelectSubset<T, StorageProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StorageProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StorageProfiles
     * const storageProfile = await prisma.storageProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StorageProfileUpdateManyArgs>(args: SelectSubset<T, StorageProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StorageProfile.
     * @param {StorageProfileUpsertArgs} args - Arguments to update or create a StorageProfile.
     * @example
     * // Update or create a StorageProfile
     * const storageProfile = await prisma.storageProfile.upsert({
     *   create: {
     *     // ... data to create a StorageProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StorageProfile we want to update
     *   }
     * })
     */
    upsert<T extends StorageProfileUpsertArgs>(args: SelectSubset<T, StorageProfileUpsertArgs<ExtArgs>>): Prisma__StorageProfileClient<$Result.GetResult<Prisma.$StorageProfilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StorageProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageProfileCountArgs} args - Arguments to filter StorageProfiles to count.
     * @example
     * // Count the number of StorageProfiles
     * const count = await prisma.storageProfile.count({
     *   where: {
     *     // ... the filter for the StorageProfiles we want to count
     *   }
     * })
    **/
    count<T extends StorageProfileCountArgs>(
      args?: Subset<T, StorageProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StorageProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StorageProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StorageProfileAggregateArgs>(args: Subset<T, StorageProfileAggregateArgs>): Prisma.PrismaPromise<GetStorageProfileAggregateType<T>>

    /**
     * Group by StorageProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StorageProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StorageProfileGroupByArgs['orderBy'] }
        : { orderBy?: StorageProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StorageProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStorageProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StorageProfile model
   */
  readonly fields: StorageProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StorageProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StorageProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    commodity<T extends CommodityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommodityDefaultArgs<ExtArgs>>): Prisma__CommodityClient<$Result.GetResult<Prisma.$CommodityPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StorageProfile model
   */ 
  interface StorageProfileFieldRefs {
    readonly id: FieldRef<"StorageProfile", 'String'>
    readonly commodityId: FieldRef<"StorageProfile", 'String'>
    readonly mode: FieldRef<"StorageProfile", 'StorageMode'>
    readonly tempRange: FieldRef<"StorageProfile", 'String'>
    readonly humidityRange: FieldRef<"StorageProfile", 'String'>
    readonly maxDays: FieldRef<"StorageProfile", 'Int'>
    readonly spoilageRiskNote: FieldRef<"StorageProfile", 'String'>
    readonly createdAt: FieldRef<"StorageProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StorageProfile findUnique
   */
  export type StorageProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * Filter, which StorageProfile to fetch.
     */
    where: StorageProfileWhereUniqueInput
  }

  /**
   * StorageProfile findUniqueOrThrow
   */
  export type StorageProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * Filter, which StorageProfile to fetch.
     */
    where: StorageProfileWhereUniqueInput
  }

  /**
   * StorageProfile findFirst
   */
  export type StorageProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * Filter, which StorageProfile to fetch.
     */
    where?: StorageProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageProfiles to fetch.
     */
    orderBy?: StorageProfileOrderByWithRelationInput | StorageProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageProfiles.
     */
    cursor?: StorageProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageProfiles.
     */
    distinct?: StorageProfileScalarFieldEnum | StorageProfileScalarFieldEnum[]
  }

  /**
   * StorageProfile findFirstOrThrow
   */
  export type StorageProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * Filter, which StorageProfile to fetch.
     */
    where?: StorageProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageProfiles to fetch.
     */
    orderBy?: StorageProfileOrderByWithRelationInput | StorageProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageProfiles.
     */
    cursor?: StorageProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageProfiles.
     */
    distinct?: StorageProfileScalarFieldEnum | StorageProfileScalarFieldEnum[]
  }

  /**
   * StorageProfile findMany
   */
  export type StorageProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * Filter, which StorageProfiles to fetch.
     */
    where?: StorageProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageProfiles to fetch.
     */
    orderBy?: StorageProfileOrderByWithRelationInput | StorageProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StorageProfiles.
     */
    cursor?: StorageProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageProfiles.
     */
    skip?: number
    distinct?: StorageProfileScalarFieldEnum | StorageProfileScalarFieldEnum[]
  }

  /**
   * StorageProfile create
   */
  export type StorageProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a StorageProfile.
     */
    data: XOR<StorageProfileCreateInput, StorageProfileUncheckedCreateInput>
  }

  /**
   * StorageProfile createMany
   */
  export type StorageProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StorageProfiles.
     */
    data: StorageProfileCreateManyInput | StorageProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StorageProfile createManyAndReturn
   */
  export type StorageProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StorageProfiles.
     */
    data: StorageProfileCreateManyInput | StorageProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StorageProfile update
   */
  export type StorageProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a StorageProfile.
     */
    data: XOR<StorageProfileUpdateInput, StorageProfileUncheckedUpdateInput>
    /**
     * Choose, which StorageProfile to update.
     */
    where: StorageProfileWhereUniqueInput
  }

  /**
   * StorageProfile updateMany
   */
  export type StorageProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StorageProfiles.
     */
    data: XOR<StorageProfileUpdateManyMutationInput, StorageProfileUncheckedUpdateManyInput>
    /**
     * Filter which StorageProfiles to update
     */
    where?: StorageProfileWhereInput
  }

  /**
   * StorageProfile upsert
   */
  export type StorageProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the StorageProfile to update in case it exists.
     */
    where: StorageProfileWhereUniqueInput
    /**
     * In case the StorageProfile found by the `where` argument doesn't exist, create a new StorageProfile with this data.
     */
    create: XOR<StorageProfileCreateInput, StorageProfileUncheckedCreateInput>
    /**
     * In case the StorageProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StorageProfileUpdateInput, StorageProfileUncheckedUpdateInput>
  }

  /**
   * StorageProfile delete
   */
  export type StorageProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
    /**
     * Filter which StorageProfile to delete.
     */
    where: StorageProfileWhereUniqueInput
  }

  /**
   * StorageProfile deleteMany
   */
  export type StorageProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageProfiles to delete
     */
    where?: StorageProfileWhereInput
  }

  /**
   * StorageProfile without action
   */
  export type StorageProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageProfile
     */
    select?: StorageProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageProfileInclude<ExtArgs> | null
  }


  /**
   * Model RecommendationOutcome
   */

  export type AggregateRecommendationOutcome = {
    _count: RecommendationOutcomeCountAggregateOutputType | null
    _avg: RecommendationOutcomeAvgAggregateOutputType | null
    _sum: RecommendationOutcomeSumAggregateOutputType | null
    _min: RecommendationOutcomeMinAggregateOutputType | null
    _max: RecommendationOutcomeMaxAggregateOutputType | null
  }

  export type RecommendationOutcomeAvgAggregateOutputType = {
    executedQtyTons: Decimal | null
    realizedBuyAvg: Decimal | null
    realizedSellAvg: Decimal | null
    realizedMargin: Decimal | null
    spoilagePct: Decimal | null
  }

  export type RecommendationOutcomeSumAggregateOutputType = {
    executedQtyTons: Decimal | null
    realizedBuyAvg: Decimal | null
    realizedSellAvg: Decimal | null
    realizedMargin: Decimal | null
    spoilagePct: Decimal | null
  }

  export type RecommendationOutcomeMinAggregateOutputType = {
    id: string | null
    recommendationId: string | null
    executed: boolean | null
    executedQtyTons: Decimal | null
    realizedBuyAvg: Decimal | null
    realizedSellAvg: Decimal | null
    realizedMargin: Decimal | null
    spoilagePct: Decimal | null
    notes: string | null
    recordedAt: Date | null
  }

  export type RecommendationOutcomeMaxAggregateOutputType = {
    id: string | null
    recommendationId: string | null
    executed: boolean | null
    executedQtyTons: Decimal | null
    realizedBuyAvg: Decimal | null
    realizedSellAvg: Decimal | null
    realizedMargin: Decimal | null
    spoilagePct: Decimal | null
    notes: string | null
    recordedAt: Date | null
  }

  export type RecommendationOutcomeCountAggregateOutputType = {
    id: number
    recommendationId: number
    executed: number
    executedQtyTons: number
    realizedBuyAvg: number
    realizedSellAvg: number
    realizedMargin: number
    spoilagePct: number
    notes: number
    recordedAt: number
    _all: number
  }


  export type RecommendationOutcomeAvgAggregateInputType = {
    executedQtyTons?: true
    realizedBuyAvg?: true
    realizedSellAvg?: true
    realizedMargin?: true
    spoilagePct?: true
  }

  export type RecommendationOutcomeSumAggregateInputType = {
    executedQtyTons?: true
    realizedBuyAvg?: true
    realizedSellAvg?: true
    realizedMargin?: true
    spoilagePct?: true
  }

  export type RecommendationOutcomeMinAggregateInputType = {
    id?: true
    recommendationId?: true
    executed?: true
    executedQtyTons?: true
    realizedBuyAvg?: true
    realizedSellAvg?: true
    realizedMargin?: true
    spoilagePct?: true
    notes?: true
    recordedAt?: true
  }

  export type RecommendationOutcomeMaxAggregateInputType = {
    id?: true
    recommendationId?: true
    executed?: true
    executedQtyTons?: true
    realizedBuyAvg?: true
    realizedSellAvg?: true
    realizedMargin?: true
    spoilagePct?: true
    notes?: true
    recordedAt?: true
  }

  export type RecommendationOutcomeCountAggregateInputType = {
    id?: true
    recommendationId?: true
    executed?: true
    executedQtyTons?: true
    realizedBuyAvg?: true
    realizedSellAvg?: true
    realizedMargin?: true
    spoilagePct?: true
    notes?: true
    recordedAt?: true
    _all?: true
  }

  export type RecommendationOutcomeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecommendationOutcome to aggregate.
     */
    where?: RecommendationOutcomeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecommendationOutcomes to fetch.
     */
    orderBy?: RecommendationOutcomeOrderByWithRelationInput | RecommendationOutcomeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecommendationOutcomeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecommendationOutcomes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecommendationOutcomes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RecommendationOutcomes
    **/
    _count?: true | RecommendationOutcomeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecommendationOutcomeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecommendationOutcomeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecommendationOutcomeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecommendationOutcomeMaxAggregateInputType
  }

  export type GetRecommendationOutcomeAggregateType<T extends RecommendationOutcomeAggregateArgs> = {
        [P in keyof T & keyof AggregateRecommendationOutcome]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecommendationOutcome[P]>
      : GetScalarType<T[P], AggregateRecommendationOutcome[P]>
  }




  export type RecommendationOutcomeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecommendationOutcomeWhereInput
    orderBy?: RecommendationOutcomeOrderByWithAggregationInput | RecommendationOutcomeOrderByWithAggregationInput[]
    by: RecommendationOutcomeScalarFieldEnum[] | RecommendationOutcomeScalarFieldEnum
    having?: RecommendationOutcomeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecommendationOutcomeCountAggregateInputType | true
    _avg?: RecommendationOutcomeAvgAggregateInputType
    _sum?: RecommendationOutcomeSumAggregateInputType
    _min?: RecommendationOutcomeMinAggregateInputType
    _max?: RecommendationOutcomeMaxAggregateInputType
  }

  export type RecommendationOutcomeGroupByOutputType = {
    id: string
    recommendationId: string
    executed: boolean
    executedQtyTons: Decimal | null
    realizedBuyAvg: Decimal | null
    realizedSellAvg: Decimal | null
    realizedMargin: Decimal | null
    spoilagePct: Decimal | null
    notes: string | null
    recordedAt: Date
    _count: RecommendationOutcomeCountAggregateOutputType | null
    _avg: RecommendationOutcomeAvgAggregateOutputType | null
    _sum: RecommendationOutcomeSumAggregateOutputType | null
    _min: RecommendationOutcomeMinAggregateOutputType | null
    _max: RecommendationOutcomeMaxAggregateOutputType | null
  }

  type GetRecommendationOutcomeGroupByPayload<T extends RecommendationOutcomeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecommendationOutcomeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecommendationOutcomeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecommendationOutcomeGroupByOutputType[P]>
            : GetScalarType<T[P], RecommendationOutcomeGroupByOutputType[P]>
        }
      >
    >


  export type RecommendationOutcomeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recommendationId?: boolean
    executed?: boolean
    executedQtyTons?: boolean
    realizedBuyAvg?: boolean
    realizedSellAvg?: boolean
    realizedMargin?: boolean
    spoilagePct?: boolean
    notes?: boolean
    recordedAt?: boolean
    recommendation?: boolean | RecommendationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendationOutcome"]>

  export type RecommendationOutcomeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recommendationId?: boolean
    executed?: boolean
    executedQtyTons?: boolean
    realizedBuyAvg?: boolean
    realizedSellAvg?: boolean
    realizedMargin?: boolean
    spoilagePct?: boolean
    notes?: boolean
    recordedAt?: boolean
    recommendation?: boolean | RecommendationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recommendationOutcome"]>

  export type RecommendationOutcomeSelectScalar = {
    id?: boolean
    recommendationId?: boolean
    executed?: boolean
    executedQtyTons?: boolean
    realizedBuyAvg?: boolean
    realizedSellAvg?: boolean
    realizedMargin?: boolean
    spoilagePct?: boolean
    notes?: boolean
    recordedAt?: boolean
  }

  export type RecommendationOutcomeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recommendation?: boolean | RecommendationDefaultArgs<ExtArgs>
  }
  export type RecommendationOutcomeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recommendation?: boolean | RecommendationDefaultArgs<ExtArgs>
  }

  export type $RecommendationOutcomePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RecommendationOutcome"
    objects: {
      recommendation: Prisma.$RecommendationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      recommendationId: string
      executed: boolean
      executedQtyTons: Prisma.Decimal | null
      realizedBuyAvg: Prisma.Decimal | null
      realizedSellAvg: Prisma.Decimal | null
      realizedMargin: Prisma.Decimal | null
      spoilagePct: Prisma.Decimal | null
      notes: string | null
      recordedAt: Date
    }, ExtArgs["result"]["recommendationOutcome"]>
    composites: {}
  }

  type RecommendationOutcomeGetPayload<S extends boolean | null | undefined | RecommendationOutcomeDefaultArgs> = $Result.GetResult<Prisma.$RecommendationOutcomePayload, S>

  type RecommendationOutcomeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RecommendationOutcomeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RecommendationOutcomeCountAggregateInputType | true
    }

  export interface RecommendationOutcomeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RecommendationOutcome'], meta: { name: 'RecommendationOutcome' } }
    /**
     * Find zero or one RecommendationOutcome that matches the filter.
     * @param {RecommendationOutcomeFindUniqueArgs} args - Arguments to find a RecommendationOutcome
     * @example
     * // Get one RecommendationOutcome
     * const recommendationOutcome = await prisma.recommendationOutcome.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecommendationOutcomeFindUniqueArgs>(args: SelectSubset<T, RecommendationOutcomeFindUniqueArgs<ExtArgs>>): Prisma__RecommendationOutcomeClient<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RecommendationOutcome that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RecommendationOutcomeFindUniqueOrThrowArgs} args - Arguments to find a RecommendationOutcome
     * @example
     * // Get one RecommendationOutcome
     * const recommendationOutcome = await prisma.recommendationOutcome.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecommendationOutcomeFindUniqueOrThrowArgs>(args: SelectSubset<T, RecommendationOutcomeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecommendationOutcomeClient<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RecommendationOutcome that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationOutcomeFindFirstArgs} args - Arguments to find a RecommendationOutcome
     * @example
     * // Get one RecommendationOutcome
     * const recommendationOutcome = await prisma.recommendationOutcome.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecommendationOutcomeFindFirstArgs>(args?: SelectSubset<T, RecommendationOutcomeFindFirstArgs<ExtArgs>>): Prisma__RecommendationOutcomeClient<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RecommendationOutcome that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationOutcomeFindFirstOrThrowArgs} args - Arguments to find a RecommendationOutcome
     * @example
     * // Get one RecommendationOutcome
     * const recommendationOutcome = await prisma.recommendationOutcome.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecommendationOutcomeFindFirstOrThrowArgs>(args?: SelectSubset<T, RecommendationOutcomeFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecommendationOutcomeClient<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RecommendationOutcomes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationOutcomeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RecommendationOutcomes
     * const recommendationOutcomes = await prisma.recommendationOutcome.findMany()
     * 
     * // Get first 10 RecommendationOutcomes
     * const recommendationOutcomes = await prisma.recommendationOutcome.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recommendationOutcomeWithIdOnly = await prisma.recommendationOutcome.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecommendationOutcomeFindManyArgs>(args?: SelectSubset<T, RecommendationOutcomeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RecommendationOutcome.
     * @param {RecommendationOutcomeCreateArgs} args - Arguments to create a RecommendationOutcome.
     * @example
     * // Create one RecommendationOutcome
     * const RecommendationOutcome = await prisma.recommendationOutcome.create({
     *   data: {
     *     // ... data to create a RecommendationOutcome
     *   }
     * })
     * 
     */
    create<T extends RecommendationOutcomeCreateArgs>(args: SelectSubset<T, RecommendationOutcomeCreateArgs<ExtArgs>>): Prisma__RecommendationOutcomeClient<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RecommendationOutcomes.
     * @param {RecommendationOutcomeCreateManyArgs} args - Arguments to create many RecommendationOutcomes.
     * @example
     * // Create many RecommendationOutcomes
     * const recommendationOutcome = await prisma.recommendationOutcome.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecommendationOutcomeCreateManyArgs>(args?: SelectSubset<T, RecommendationOutcomeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RecommendationOutcomes and returns the data saved in the database.
     * @param {RecommendationOutcomeCreateManyAndReturnArgs} args - Arguments to create many RecommendationOutcomes.
     * @example
     * // Create many RecommendationOutcomes
     * const recommendationOutcome = await prisma.recommendationOutcome.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RecommendationOutcomes and only return the `id`
     * const recommendationOutcomeWithIdOnly = await prisma.recommendationOutcome.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecommendationOutcomeCreateManyAndReturnArgs>(args?: SelectSubset<T, RecommendationOutcomeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RecommendationOutcome.
     * @param {RecommendationOutcomeDeleteArgs} args - Arguments to delete one RecommendationOutcome.
     * @example
     * // Delete one RecommendationOutcome
     * const RecommendationOutcome = await prisma.recommendationOutcome.delete({
     *   where: {
     *     // ... filter to delete one RecommendationOutcome
     *   }
     * })
     * 
     */
    delete<T extends RecommendationOutcomeDeleteArgs>(args: SelectSubset<T, RecommendationOutcomeDeleteArgs<ExtArgs>>): Prisma__RecommendationOutcomeClient<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RecommendationOutcome.
     * @param {RecommendationOutcomeUpdateArgs} args - Arguments to update one RecommendationOutcome.
     * @example
     * // Update one RecommendationOutcome
     * const recommendationOutcome = await prisma.recommendationOutcome.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecommendationOutcomeUpdateArgs>(args: SelectSubset<T, RecommendationOutcomeUpdateArgs<ExtArgs>>): Prisma__RecommendationOutcomeClient<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RecommendationOutcomes.
     * @param {RecommendationOutcomeDeleteManyArgs} args - Arguments to filter RecommendationOutcomes to delete.
     * @example
     * // Delete a few RecommendationOutcomes
     * const { count } = await prisma.recommendationOutcome.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecommendationOutcomeDeleteManyArgs>(args?: SelectSubset<T, RecommendationOutcomeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecommendationOutcomes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationOutcomeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RecommendationOutcomes
     * const recommendationOutcome = await prisma.recommendationOutcome.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecommendationOutcomeUpdateManyArgs>(args: SelectSubset<T, RecommendationOutcomeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RecommendationOutcome.
     * @param {RecommendationOutcomeUpsertArgs} args - Arguments to update or create a RecommendationOutcome.
     * @example
     * // Update or create a RecommendationOutcome
     * const recommendationOutcome = await prisma.recommendationOutcome.upsert({
     *   create: {
     *     // ... data to create a RecommendationOutcome
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RecommendationOutcome we want to update
     *   }
     * })
     */
    upsert<T extends RecommendationOutcomeUpsertArgs>(args: SelectSubset<T, RecommendationOutcomeUpsertArgs<ExtArgs>>): Prisma__RecommendationOutcomeClient<$Result.GetResult<Prisma.$RecommendationOutcomePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RecommendationOutcomes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationOutcomeCountArgs} args - Arguments to filter RecommendationOutcomes to count.
     * @example
     * // Count the number of RecommendationOutcomes
     * const count = await prisma.recommendationOutcome.count({
     *   where: {
     *     // ... the filter for the RecommendationOutcomes we want to count
     *   }
     * })
    **/
    count<T extends RecommendationOutcomeCountArgs>(
      args?: Subset<T, RecommendationOutcomeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecommendationOutcomeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RecommendationOutcome.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationOutcomeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecommendationOutcomeAggregateArgs>(args: Subset<T, RecommendationOutcomeAggregateArgs>): Prisma.PrismaPromise<GetRecommendationOutcomeAggregateType<T>>

    /**
     * Group by RecommendationOutcome.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecommendationOutcomeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecommendationOutcomeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecommendationOutcomeGroupByArgs['orderBy'] }
        : { orderBy?: RecommendationOutcomeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecommendationOutcomeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecommendationOutcomeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RecommendationOutcome model
   */
  readonly fields: RecommendationOutcomeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RecommendationOutcome.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecommendationOutcomeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    recommendation<T extends RecommendationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RecommendationDefaultArgs<ExtArgs>>): Prisma__RecommendationClient<$Result.GetResult<Prisma.$RecommendationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RecommendationOutcome model
   */ 
  interface RecommendationOutcomeFieldRefs {
    readonly id: FieldRef<"RecommendationOutcome", 'String'>
    readonly recommendationId: FieldRef<"RecommendationOutcome", 'String'>
    readonly executed: FieldRef<"RecommendationOutcome", 'Boolean'>
    readonly executedQtyTons: FieldRef<"RecommendationOutcome", 'Decimal'>
    readonly realizedBuyAvg: FieldRef<"RecommendationOutcome", 'Decimal'>
    readonly realizedSellAvg: FieldRef<"RecommendationOutcome", 'Decimal'>
    readonly realizedMargin: FieldRef<"RecommendationOutcome", 'Decimal'>
    readonly spoilagePct: FieldRef<"RecommendationOutcome", 'Decimal'>
    readonly notes: FieldRef<"RecommendationOutcome", 'String'>
    readonly recordedAt: FieldRef<"RecommendationOutcome", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RecommendationOutcome findUnique
   */
  export type RecommendationOutcomeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationOutcome to fetch.
     */
    where: RecommendationOutcomeWhereUniqueInput
  }

  /**
   * RecommendationOutcome findUniqueOrThrow
   */
  export type RecommendationOutcomeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationOutcome to fetch.
     */
    where: RecommendationOutcomeWhereUniqueInput
  }

  /**
   * RecommendationOutcome findFirst
   */
  export type RecommendationOutcomeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationOutcome to fetch.
     */
    where?: RecommendationOutcomeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecommendationOutcomes to fetch.
     */
    orderBy?: RecommendationOutcomeOrderByWithRelationInput | RecommendationOutcomeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecommendationOutcomes.
     */
    cursor?: RecommendationOutcomeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecommendationOutcomes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecommendationOutcomes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecommendationOutcomes.
     */
    distinct?: RecommendationOutcomeScalarFieldEnum | RecommendationOutcomeScalarFieldEnum[]
  }

  /**
   * RecommendationOutcome findFirstOrThrow
   */
  export type RecommendationOutcomeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationOutcome to fetch.
     */
    where?: RecommendationOutcomeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecommendationOutcomes to fetch.
     */
    orderBy?: RecommendationOutcomeOrderByWithRelationInput | RecommendationOutcomeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecommendationOutcomes.
     */
    cursor?: RecommendationOutcomeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecommendationOutcomes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecommendationOutcomes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecommendationOutcomes.
     */
    distinct?: RecommendationOutcomeScalarFieldEnum | RecommendationOutcomeScalarFieldEnum[]
  }

  /**
   * RecommendationOutcome findMany
   */
  export type RecommendationOutcomeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * Filter, which RecommendationOutcomes to fetch.
     */
    where?: RecommendationOutcomeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecommendationOutcomes to fetch.
     */
    orderBy?: RecommendationOutcomeOrderByWithRelationInput | RecommendationOutcomeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RecommendationOutcomes.
     */
    cursor?: RecommendationOutcomeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecommendationOutcomes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecommendationOutcomes.
     */
    skip?: number
    distinct?: RecommendationOutcomeScalarFieldEnum | RecommendationOutcomeScalarFieldEnum[]
  }

  /**
   * RecommendationOutcome create
   */
  export type RecommendationOutcomeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * The data needed to create a RecommendationOutcome.
     */
    data: XOR<RecommendationOutcomeCreateInput, RecommendationOutcomeUncheckedCreateInput>
  }

  /**
   * RecommendationOutcome createMany
   */
  export type RecommendationOutcomeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RecommendationOutcomes.
     */
    data: RecommendationOutcomeCreateManyInput | RecommendationOutcomeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RecommendationOutcome createManyAndReturn
   */
  export type RecommendationOutcomeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RecommendationOutcomes.
     */
    data: RecommendationOutcomeCreateManyInput | RecommendationOutcomeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RecommendationOutcome update
   */
  export type RecommendationOutcomeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * The data needed to update a RecommendationOutcome.
     */
    data: XOR<RecommendationOutcomeUpdateInput, RecommendationOutcomeUncheckedUpdateInput>
    /**
     * Choose, which RecommendationOutcome to update.
     */
    where: RecommendationOutcomeWhereUniqueInput
  }

  /**
   * RecommendationOutcome updateMany
   */
  export type RecommendationOutcomeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RecommendationOutcomes.
     */
    data: XOR<RecommendationOutcomeUpdateManyMutationInput, RecommendationOutcomeUncheckedUpdateManyInput>
    /**
     * Filter which RecommendationOutcomes to update
     */
    where?: RecommendationOutcomeWhereInput
  }

  /**
   * RecommendationOutcome upsert
   */
  export type RecommendationOutcomeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * The filter to search for the RecommendationOutcome to update in case it exists.
     */
    where: RecommendationOutcomeWhereUniqueInput
    /**
     * In case the RecommendationOutcome found by the `where` argument doesn't exist, create a new RecommendationOutcome with this data.
     */
    create: XOR<RecommendationOutcomeCreateInput, RecommendationOutcomeUncheckedCreateInput>
    /**
     * In case the RecommendationOutcome was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecommendationOutcomeUpdateInput, RecommendationOutcomeUncheckedUpdateInput>
  }

  /**
   * RecommendationOutcome delete
   */
  export type RecommendationOutcomeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
    /**
     * Filter which RecommendationOutcome to delete.
     */
    where: RecommendationOutcomeWhereUniqueInput
  }

  /**
   * RecommendationOutcome deleteMany
   */
  export type RecommendationOutcomeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecommendationOutcomes to delete
     */
    where?: RecommendationOutcomeWhereInput
  }

  /**
   * RecommendationOutcome without action
   */
  export type RecommendationOutcomeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecommendationOutcome
     */
    select?: RecommendationOutcomeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecommendationOutcomeInclude<ExtArgs> | null
  }


  /**
   * Model SeoContentJob
   */

  export type AggregateSeoContentJob = {
    _count: SeoContentJobCountAggregateOutputType | null
    _avg: SeoContentJobAvgAggregateOutputType | null
    _sum: SeoContentJobSumAggregateOutputType | null
    _min: SeoContentJobMinAggregateOutputType | null
    _max: SeoContentJobMaxAggregateOutputType | null
  }

  export type SeoContentJobAvgAggregateOutputType = {
    impressions: number | null
    clicks: number | null
  }

  export type SeoContentJobSumAggregateOutputType = {
    impressions: number | null
    clicks: number | null
  }

  export type SeoContentJobMinAggregateOutputType = {
    id: string | null
    topic: string | null
    targetPersona: string | null
    primaryKeyword: string | null
    status: $Enums.SeoStatus | null
    url: string | null
    impressions: number | null
    clicks: number | null
    createdAt: Date | null
  }

  export type SeoContentJobMaxAggregateOutputType = {
    id: string | null
    topic: string | null
    targetPersona: string | null
    primaryKeyword: string | null
    status: $Enums.SeoStatus | null
    url: string | null
    impressions: number | null
    clicks: number | null
    createdAt: Date | null
  }

  export type SeoContentJobCountAggregateOutputType = {
    id: number
    topic: number
    targetPersona: number
    primaryKeyword: number
    secondaryKeywords: number
    status: number
    url: number
    impressions: number
    clicks: number
    createdAt: number
    _all: number
  }


  export type SeoContentJobAvgAggregateInputType = {
    impressions?: true
    clicks?: true
  }

  export type SeoContentJobSumAggregateInputType = {
    impressions?: true
    clicks?: true
  }

  export type SeoContentJobMinAggregateInputType = {
    id?: true
    topic?: true
    targetPersona?: true
    primaryKeyword?: true
    status?: true
    url?: true
    impressions?: true
    clicks?: true
    createdAt?: true
  }

  export type SeoContentJobMaxAggregateInputType = {
    id?: true
    topic?: true
    targetPersona?: true
    primaryKeyword?: true
    status?: true
    url?: true
    impressions?: true
    clicks?: true
    createdAt?: true
  }

  export type SeoContentJobCountAggregateInputType = {
    id?: true
    topic?: true
    targetPersona?: true
    primaryKeyword?: true
    secondaryKeywords?: true
    status?: true
    url?: true
    impressions?: true
    clicks?: true
    createdAt?: true
    _all?: true
  }

  export type SeoContentJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeoContentJob to aggregate.
     */
    where?: SeoContentJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeoContentJobs to fetch.
     */
    orderBy?: SeoContentJobOrderByWithRelationInput | SeoContentJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeoContentJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeoContentJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeoContentJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SeoContentJobs
    **/
    _count?: true | SeoContentJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SeoContentJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SeoContentJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeoContentJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeoContentJobMaxAggregateInputType
  }

  export type GetSeoContentJobAggregateType<T extends SeoContentJobAggregateArgs> = {
        [P in keyof T & keyof AggregateSeoContentJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeoContentJob[P]>
      : GetScalarType<T[P], AggregateSeoContentJob[P]>
  }




  export type SeoContentJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeoContentJobWhereInput
    orderBy?: SeoContentJobOrderByWithAggregationInput | SeoContentJobOrderByWithAggregationInput[]
    by: SeoContentJobScalarFieldEnum[] | SeoContentJobScalarFieldEnum
    having?: SeoContentJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeoContentJobCountAggregateInputType | true
    _avg?: SeoContentJobAvgAggregateInputType
    _sum?: SeoContentJobSumAggregateInputType
    _min?: SeoContentJobMinAggregateInputType
    _max?: SeoContentJobMaxAggregateInputType
  }

  export type SeoContentJobGroupByOutputType = {
    id: string
    topic: string
    targetPersona: string
    primaryKeyword: string
    secondaryKeywords: JsonValue
    status: $Enums.SeoStatus
    url: string | null
    impressions: number
    clicks: number
    createdAt: Date
    _count: SeoContentJobCountAggregateOutputType | null
    _avg: SeoContentJobAvgAggregateOutputType | null
    _sum: SeoContentJobSumAggregateOutputType | null
    _min: SeoContentJobMinAggregateOutputType | null
    _max: SeoContentJobMaxAggregateOutputType | null
  }

  type GetSeoContentJobGroupByPayload<T extends SeoContentJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeoContentJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeoContentJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeoContentJobGroupByOutputType[P]>
            : GetScalarType<T[P], SeoContentJobGroupByOutputType[P]>
        }
      >
    >


  export type SeoContentJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic?: boolean
    targetPersona?: boolean
    primaryKeyword?: boolean
    secondaryKeywords?: boolean
    status?: boolean
    url?: boolean
    impressions?: boolean
    clicks?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["seoContentJob"]>

  export type SeoContentJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic?: boolean
    targetPersona?: boolean
    primaryKeyword?: boolean
    secondaryKeywords?: boolean
    status?: boolean
    url?: boolean
    impressions?: boolean
    clicks?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["seoContentJob"]>

  export type SeoContentJobSelectScalar = {
    id?: boolean
    topic?: boolean
    targetPersona?: boolean
    primaryKeyword?: boolean
    secondaryKeywords?: boolean
    status?: boolean
    url?: boolean
    impressions?: boolean
    clicks?: boolean
    createdAt?: boolean
  }


  export type $SeoContentJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SeoContentJob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      topic: string
      targetPersona: string
      primaryKeyword: string
      secondaryKeywords: Prisma.JsonValue
      status: $Enums.SeoStatus
      url: string | null
      impressions: number
      clicks: number
      createdAt: Date
    }, ExtArgs["result"]["seoContentJob"]>
    composites: {}
  }

  type SeoContentJobGetPayload<S extends boolean | null | undefined | SeoContentJobDefaultArgs> = $Result.GetResult<Prisma.$SeoContentJobPayload, S>

  type SeoContentJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SeoContentJobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SeoContentJobCountAggregateInputType | true
    }

  export interface SeoContentJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SeoContentJob'], meta: { name: 'SeoContentJob' } }
    /**
     * Find zero or one SeoContentJob that matches the filter.
     * @param {SeoContentJobFindUniqueArgs} args - Arguments to find a SeoContentJob
     * @example
     * // Get one SeoContentJob
     * const seoContentJob = await prisma.seoContentJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeoContentJobFindUniqueArgs>(args: SelectSubset<T, SeoContentJobFindUniqueArgs<ExtArgs>>): Prisma__SeoContentJobClient<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SeoContentJob that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SeoContentJobFindUniqueOrThrowArgs} args - Arguments to find a SeoContentJob
     * @example
     * // Get one SeoContentJob
     * const seoContentJob = await prisma.seoContentJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeoContentJobFindUniqueOrThrowArgs>(args: SelectSubset<T, SeoContentJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeoContentJobClient<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SeoContentJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeoContentJobFindFirstArgs} args - Arguments to find a SeoContentJob
     * @example
     * // Get one SeoContentJob
     * const seoContentJob = await prisma.seoContentJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeoContentJobFindFirstArgs>(args?: SelectSubset<T, SeoContentJobFindFirstArgs<ExtArgs>>): Prisma__SeoContentJobClient<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SeoContentJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeoContentJobFindFirstOrThrowArgs} args - Arguments to find a SeoContentJob
     * @example
     * // Get one SeoContentJob
     * const seoContentJob = await prisma.seoContentJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeoContentJobFindFirstOrThrowArgs>(args?: SelectSubset<T, SeoContentJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeoContentJobClient<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SeoContentJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeoContentJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeoContentJobs
     * const seoContentJobs = await prisma.seoContentJob.findMany()
     * 
     * // Get first 10 SeoContentJobs
     * const seoContentJobs = await prisma.seoContentJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seoContentJobWithIdOnly = await prisma.seoContentJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeoContentJobFindManyArgs>(args?: SelectSubset<T, SeoContentJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SeoContentJob.
     * @param {SeoContentJobCreateArgs} args - Arguments to create a SeoContentJob.
     * @example
     * // Create one SeoContentJob
     * const SeoContentJob = await prisma.seoContentJob.create({
     *   data: {
     *     // ... data to create a SeoContentJob
     *   }
     * })
     * 
     */
    create<T extends SeoContentJobCreateArgs>(args: SelectSubset<T, SeoContentJobCreateArgs<ExtArgs>>): Prisma__SeoContentJobClient<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SeoContentJobs.
     * @param {SeoContentJobCreateManyArgs} args - Arguments to create many SeoContentJobs.
     * @example
     * // Create many SeoContentJobs
     * const seoContentJob = await prisma.seoContentJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeoContentJobCreateManyArgs>(args?: SelectSubset<T, SeoContentJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SeoContentJobs and returns the data saved in the database.
     * @param {SeoContentJobCreateManyAndReturnArgs} args - Arguments to create many SeoContentJobs.
     * @example
     * // Create many SeoContentJobs
     * const seoContentJob = await prisma.seoContentJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SeoContentJobs and only return the `id`
     * const seoContentJobWithIdOnly = await prisma.seoContentJob.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SeoContentJobCreateManyAndReturnArgs>(args?: SelectSubset<T, SeoContentJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SeoContentJob.
     * @param {SeoContentJobDeleteArgs} args - Arguments to delete one SeoContentJob.
     * @example
     * // Delete one SeoContentJob
     * const SeoContentJob = await prisma.seoContentJob.delete({
     *   where: {
     *     // ... filter to delete one SeoContentJob
     *   }
     * })
     * 
     */
    delete<T extends SeoContentJobDeleteArgs>(args: SelectSubset<T, SeoContentJobDeleteArgs<ExtArgs>>): Prisma__SeoContentJobClient<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SeoContentJob.
     * @param {SeoContentJobUpdateArgs} args - Arguments to update one SeoContentJob.
     * @example
     * // Update one SeoContentJob
     * const seoContentJob = await prisma.seoContentJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeoContentJobUpdateArgs>(args: SelectSubset<T, SeoContentJobUpdateArgs<ExtArgs>>): Prisma__SeoContentJobClient<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SeoContentJobs.
     * @param {SeoContentJobDeleteManyArgs} args - Arguments to filter SeoContentJobs to delete.
     * @example
     * // Delete a few SeoContentJobs
     * const { count } = await prisma.seoContentJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeoContentJobDeleteManyArgs>(args?: SelectSubset<T, SeoContentJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeoContentJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeoContentJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeoContentJobs
     * const seoContentJob = await prisma.seoContentJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeoContentJobUpdateManyArgs>(args: SelectSubset<T, SeoContentJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SeoContentJob.
     * @param {SeoContentJobUpsertArgs} args - Arguments to update or create a SeoContentJob.
     * @example
     * // Update or create a SeoContentJob
     * const seoContentJob = await prisma.seoContentJob.upsert({
     *   create: {
     *     // ... data to create a SeoContentJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeoContentJob we want to update
     *   }
     * })
     */
    upsert<T extends SeoContentJobUpsertArgs>(args: SelectSubset<T, SeoContentJobUpsertArgs<ExtArgs>>): Prisma__SeoContentJobClient<$Result.GetResult<Prisma.$SeoContentJobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SeoContentJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeoContentJobCountArgs} args - Arguments to filter SeoContentJobs to count.
     * @example
     * // Count the number of SeoContentJobs
     * const count = await prisma.seoContentJob.count({
     *   where: {
     *     // ... the filter for the SeoContentJobs we want to count
     *   }
     * })
    **/
    count<T extends SeoContentJobCountArgs>(
      args?: Subset<T, SeoContentJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeoContentJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeoContentJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeoContentJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeoContentJobAggregateArgs>(args: Subset<T, SeoContentJobAggregateArgs>): Prisma.PrismaPromise<GetSeoContentJobAggregateType<T>>

    /**
     * Group by SeoContentJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeoContentJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeoContentJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeoContentJobGroupByArgs['orderBy'] }
        : { orderBy?: SeoContentJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeoContentJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeoContentJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SeoContentJob model
   */
  readonly fields: SeoContentJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeoContentJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeoContentJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SeoContentJob model
   */ 
  interface SeoContentJobFieldRefs {
    readonly id: FieldRef<"SeoContentJob", 'String'>
    readonly topic: FieldRef<"SeoContentJob", 'String'>
    readonly targetPersona: FieldRef<"SeoContentJob", 'String'>
    readonly primaryKeyword: FieldRef<"SeoContentJob", 'String'>
    readonly secondaryKeywords: FieldRef<"SeoContentJob", 'Json'>
    readonly status: FieldRef<"SeoContentJob", 'SeoStatus'>
    readonly url: FieldRef<"SeoContentJob", 'String'>
    readonly impressions: FieldRef<"SeoContentJob", 'Int'>
    readonly clicks: FieldRef<"SeoContentJob", 'Int'>
    readonly createdAt: FieldRef<"SeoContentJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SeoContentJob findUnique
   */
  export type SeoContentJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * Filter, which SeoContentJob to fetch.
     */
    where: SeoContentJobWhereUniqueInput
  }

  /**
   * SeoContentJob findUniqueOrThrow
   */
  export type SeoContentJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * Filter, which SeoContentJob to fetch.
     */
    where: SeoContentJobWhereUniqueInput
  }

  /**
   * SeoContentJob findFirst
   */
  export type SeoContentJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * Filter, which SeoContentJob to fetch.
     */
    where?: SeoContentJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeoContentJobs to fetch.
     */
    orderBy?: SeoContentJobOrderByWithRelationInput | SeoContentJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeoContentJobs.
     */
    cursor?: SeoContentJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeoContentJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeoContentJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeoContentJobs.
     */
    distinct?: SeoContentJobScalarFieldEnum | SeoContentJobScalarFieldEnum[]
  }

  /**
   * SeoContentJob findFirstOrThrow
   */
  export type SeoContentJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * Filter, which SeoContentJob to fetch.
     */
    where?: SeoContentJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeoContentJobs to fetch.
     */
    orderBy?: SeoContentJobOrderByWithRelationInput | SeoContentJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeoContentJobs.
     */
    cursor?: SeoContentJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeoContentJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeoContentJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeoContentJobs.
     */
    distinct?: SeoContentJobScalarFieldEnum | SeoContentJobScalarFieldEnum[]
  }

  /**
   * SeoContentJob findMany
   */
  export type SeoContentJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * Filter, which SeoContentJobs to fetch.
     */
    where?: SeoContentJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeoContentJobs to fetch.
     */
    orderBy?: SeoContentJobOrderByWithRelationInput | SeoContentJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SeoContentJobs.
     */
    cursor?: SeoContentJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeoContentJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeoContentJobs.
     */
    skip?: number
    distinct?: SeoContentJobScalarFieldEnum | SeoContentJobScalarFieldEnum[]
  }

  /**
   * SeoContentJob create
   */
  export type SeoContentJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * The data needed to create a SeoContentJob.
     */
    data: XOR<SeoContentJobCreateInput, SeoContentJobUncheckedCreateInput>
  }

  /**
   * SeoContentJob createMany
   */
  export type SeoContentJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeoContentJobs.
     */
    data: SeoContentJobCreateManyInput | SeoContentJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeoContentJob createManyAndReturn
   */
  export type SeoContentJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SeoContentJobs.
     */
    data: SeoContentJobCreateManyInput | SeoContentJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeoContentJob update
   */
  export type SeoContentJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * The data needed to update a SeoContentJob.
     */
    data: XOR<SeoContentJobUpdateInput, SeoContentJobUncheckedUpdateInput>
    /**
     * Choose, which SeoContentJob to update.
     */
    where: SeoContentJobWhereUniqueInput
  }

  /**
   * SeoContentJob updateMany
   */
  export type SeoContentJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SeoContentJobs.
     */
    data: XOR<SeoContentJobUpdateManyMutationInput, SeoContentJobUncheckedUpdateManyInput>
    /**
     * Filter which SeoContentJobs to update
     */
    where?: SeoContentJobWhereInput
  }

  /**
   * SeoContentJob upsert
   */
  export type SeoContentJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * The filter to search for the SeoContentJob to update in case it exists.
     */
    where: SeoContentJobWhereUniqueInput
    /**
     * In case the SeoContentJob found by the `where` argument doesn't exist, create a new SeoContentJob with this data.
     */
    create: XOR<SeoContentJobCreateInput, SeoContentJobUncheckedCreateInput>
    /**
     * In case the SeoContentJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeoContentJobUpdateInput, SeoContentJobUncheckedUpdateInput>
  }

  /**
   * SeoContentJob delete
   */
  export type SeoContentJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
    /**
     * Filter which SeoContentJob to delete.
     */
    where: SeoContentJobWhereUniqueInput
  }

  /**
   * SeoContentJob deleteMany
   */
  export type SeoContentJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeoContentJobs to delete
     */
    where?: SeoContentJobWhereInput
  }

  /**
   * SeoContentJob without action
   */
  export type SeoContentJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeoContentJob
     */
    select?: SeoContentJobSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CommodityScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    category: 'category',
    defaultShelfLifeDays: 'defaultShelfLifeDays',
    createdAt: 'createdAt'
  };

  export type CommodityScalarFieldEnum = (typeof CommodityScalarFieldEnum)[keyof typeof CommodityScalarFieldEnum]


  export const MarketScalarFieldEnum: {
    id: 'id',
    name: 'name',
    region: 'region',
    type: 'type',
    createdAt: 'createdAt'
  };

  export type MarketScalarFieldEnum = (typeof MarketScalarFieldEnum)[keyof typeof MarketScalarFieldEnum]


  export const MandiPriceScalarFieldEnum: {
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

  export type MandiPriceScalarFieldEnum = (typeof MandiPriceScalarFieldEnum)[keyof typeof MandiPriceScalarFieldEnum]


  export const RecommendationScalarFieldEnum: {
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

  export type RecommendationScalarFieldEnum = (typeof RecommendationScalarFieldEnum)[keyof typeof RecommendationScalarFieldEnum]


  export const WeatherSnapshotScalarFieldEnum: {
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

  export type WeatherSnapshotScalarFieldEnum = (typeof WeatherSnapshotScalarFieldEnum)[keyof typeof WeatherSnapshotScalarFieldEnum]


  export const QualitySpecScalarFieldEnum: {
    id: 'id',
    commodityId: 'commodityId',
    grade: 'grade',
    parameter: 'parameter',
    minValue: 'minValue',
    maxValue: 'maxValue',
    checklistNote: 'checklistNote',
    createdAt: 'createdAt'
  };

  export type QualitySpecScalarFieldEnum = (typeof QualitySpecScalarFieldEnum)[keyof typeof QualitySpecScalarFieldEnum]


  export const StorageProfileScalarFieldEnum: {
    id: 'id',
    commodityId: 'commodityId',
    mode: 'mode',
    tempRange: 'tempRange',
    humidityRange: 'humidityRange',
    maxDays: 'maxDays',
    spoilageRiskNote: 'spoilageRiskNote',
    createdAt: 'createdAt'
  };

  export type StorageProfileScalarFieldEnum = (typeof StorageProfileScalarFieldEnum)[keyof typeof StorageProfileScalarFieldEnum]


  export const RecommendationOutcomeScalarFieldEnum: {
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

  export type RecommendationOutcomeScalarFieldEnum = (typeof RecommendationOutcomeScalarFieldEnum)[keyof typeof RecommendationOutcomeScalarFieldEnum]


  export const SeoContentJobScalarFieldEnum: {
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

  export type SeoContentJobScalarFieldEnum = (typeof SeoContentJobScalarFieldEnum)[keyof typeof SeoContentJobScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'MarketType'
   */
  export type EnumMarketTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketType'>
    


  /**
   * Reference to a field of type 'MarketType[]'
   */
  export type ListEnumMarketTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketType[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'RecommendationAction'
   */
  export type EnumRecommendationActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RecommendationAction'>
    


  /**
   * Reference to a field of type 'RecommendationAction[]'
   */
  export type ListEnumRecommendationActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RecommendationAction[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'RiskLevel'
   */
  export type EnumRiskLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RiskLevel'>
    


  /**
   * Reference to a field of type 'RiskLevel[]'
   */
  export type ListEnumRiskLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RiskLevel[]'>
    


  /**
   * Reference to a field of type 'StorageMode'
   */
  export type EnumStorageModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StorageMode'>
    


  /**
   * Reference to a field of type 'StorageMode[]'
   */
  export type ListEnumStorageModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StorageMode[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'SeoStatus'
   */
  export type EnumSeoStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SeoStatus'>
    


  /**
   * Reference to a field of type 'SeoStatus[]'
   */
  export type ListEnumSeoStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SeoStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type CommodityWhereInput = {
    AND?: CommodityWhereInput | CommodityWhereInput[]
    OR?: CommodityWhereInput[]
    NOT?: CommodityWhereInput | CommodityWhereInput[]
    id?: StringFilter<"Commodity"> | string
    code?: StringFilter<"Commodity"> | string
    name?: StringFilter<"Commodity"> | string
    category?: StringFilter<"Commodity"> | string
    defaultShelfLifeDays?: IntFilter<"Commodity"> | number
    createdAt?: DateTimeFilter<"Commodity"> | Date | string
    mandiPrices?: MandiPriceListRelationFilter
    recommendations?: RecommendationListRelationFilter
    qualitySpecs?: QualitySpecListRelationFilter
    storageProfiles?: StorageProfileListRelationFilter
  }

  export type CommodityOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrder
    defaultShelfLifeDays?: SortOrder
    createdAt?: SortOrder
    mandiPrices?: MandiPriceOrderByRelationAggregateInput
    recommendations?: RecommendationOrderByRelationAggregateInput
    qualitySpecs?: QualitySpecOrderByRelationAggregateInput
    storageProfiles?: StorageProfileOrderByRelationAggregateInput
  }

  export type CommodityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: CommodityWhereInput | CommodityWhereInput[]
    OR?: CommodityWhereInput[]
    NOT?: CommodityWhereInput | CommodityWhereInput[]
    name?: StringFilter<"Commodity"> | string
    category?: StringFilter<"Commodity"> | string
    defaultShelfLifeDays?: IntFilter<"Commodity"> | number
    createdAt?: DateTimeFilter<"Commodity"> | Date | string
    mandiPrices?: MandiPriceListRelationFilter
    recommendations?: RecommendationListRelationFilter
    qualitySpecs?: QualitySpecListRelationFilter
    storageProfiles?: StorageProfileListRelationFilter
  }, "id" | "code">

  export type CommodityOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrder
    defaultShelfLifeDays?: SortOrder
    createdAt?: SortOrder
    _count?: CommodityCountOrderByAggregateInput
    _avg?: CommodityAvgOrderByAggregateInput
    _max?: CommodityMaxOrderByAggregateInput
    _min?: CommodityMinOrderByAggregateInput
    _sum?: CommoditySumOrderByAggregateInput
  }

  export type CommodityScalarWhereWithAggregatesInput = {
    AND?: CommodityScalarWhereWithAggregatesInput | CommodityScalarWhereWithAggregatesInput[]
    OR?: CommodityScalarWhereWithAggregatesInput[]
    NOT?: CommodityScalarWhereWithAggregatesInput | CommodityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Commodity"> | string
    code?: StringWithAggregatesFilter<"Commodity"> | string
    name?: StringWithAggregatesFilter<"Commodity"> | string
    category?: StringWithAggregatesFilter<"Commodity"> | string
    defaultShelfLifeDays?: IntWithAggregatesFilter<"Commodity"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Commodity"> | Date | string
  }

  export type MarketWhereInput = {
    AND?: MarketWhereInput | MarketWhereInput[]
    OR?: MarketWhereInput[]
    NOT?: MarketWhereInput | MarketWhereInput[]
    id?: StringFilter<"Market"> | string
    name?: StringFilter<"Market"> | string
    region?: StringFilter<"Market"> | string
    type?: EnumMarketTypeFilter<"Market"> | $Enums.MarketType
    createdAt?: DateTimeFilter<"Market"> | Date | string
    mandiPrices?: MandiPriceListRelationFilter
  }

  export type MarketOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    region?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    mandiPrices?: MandiPriceOrderByRelationAggregateInput
  }

  export type MarketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MarketWhereInput | MarketWhereInput[]
    OR?: MarketWhereInput[]
    NOT?: MarketWhereInput | MarketWhereInput[]
    name?: StringFilter<"Market"> | string
    region?: StringFilter<"Market"> | string
    type?: EnumMarketTypeFilter<"Market"> | $Enums.MarketType
    createdAt?: DateTimeFilter<"Market"> | Date | string
    mandiPrices?: MandiPriceListRelationFilter
  }, "id">

  export type MarketOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    region?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    _count?: MarketCountOrderByAggregateInput
    _max?: MarketMaxOrderByAggregateInput
    _min?: MarketMinOrderByAggregateInput
  }

  export type MarketScalarWhereWithAggregatesInput = {
    AND?: MarketScalarWhereWithAggregatesInput | MarketScalarWhereWithAggregatesInput[]
    OR?: MarketScalarWhereWithAggregatesInput[]
    NOT?: MarketScalarWhereWithAggregatesInput | MarketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Market"> | string
    name?: StringWithAggregatesFilter<"Market"> | string
    region?: StringWithAggregatesFilter<"Market"> | string
    type?: EnumMarketTypeWithAggregatesFilter<"Market"> | $Enums.MarketType
    createdAt?: DateTimeWithAggregatesFilter<"Market"> | Date | string
  }

  export type MandiPriceWhereInput = {
    AND?: MandiPriceWhereInput | MandiPriceWhereInput[]
    OR?: MandiPriceWhereInput[]
    NOT?: MandiPriceWhereInput | MandiPriceWhereInput[]
    id?: StringFilter<"MandiPrice"> | string
    commodityId?: StringFilter<"MandiPrice"> | string
    marketId?: StringFilter<"MandiPrice"> | string
    priceMin?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFilter<"MandiPrice"> | Date | string
    source?: StringFilter<"MandiPrice"> | string
    createdAt?: DateTimeFilter<"MandiPrice"> | Date | string
    commodity?: XOR<CommodityRelationFilter, CommodityWhereInput>
    market?: XOR<MarketRelationFilter, MarketWhereInput>
  }

  export type MandiPriceOrderByWithRelationInput = {
    id?: SortOrder
    commodityId?: SortOrder
    marketId?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceModal?: SortOrder
    observedAt?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    commodity?: CommodityOrderByWithRelationInput
    market?: MarketOrderByWithRelationInput
  }

  export type MandiPriceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MandiPriceWhereInput | MandiPriceWhereInput[]
    OR?: MandiPriceWhereInput[]
    NOT?: MandiPriceWhereInput | MandiPriceWhereInput[]
    commodityId?: StringFilter<"MandiPrice"> | string
    marketId?: StringFilter<"MandiPrice"> | string
    priceMin?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFilter<"MandiPrice"> | Date | string
    source?: StringFilter<"MandiPrice"> | string
    createdAt?: DateTimeFilter<"MandiPrice"> | Date | string
    commodity?: XOR<CommodityRelationFilter, CommodityWhereInput>
    market?: XOR<MarketRelationFilter, MarketWhereInput>
  }, "id">

  export type MandiPriceOrderByWithAggregationInput = {
    id?: SortOrder
    commodityId?: SortOrder
    marketId?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceModal?: SortOrder
    observedAt?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    _count?: MandiPriceCountOrderByAggregateInput
    _avg?: MandiPriceAvgOrderByAggregateInput
    _max?: MandiPriceMaxOrderByAggregateInput
    _min?: MandiPriceMinOrderByAggregateInput
    _sum?: MandiPriceSumOrderByAggregateInput
  }

  export type MandiPriceScalarWhereWithAggregatesInput = {
    AND?: MandiPriceScalarWhereWithAggregatesInput | MandiPriceScalarWhereWithAggregatesInput[]
    OR?: MandiPriceScalarWhereWithAggregatesInput[]
    NOT?: MandiPriceScalarWhereWithAggregatesInput | MandiPriceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MandiPrice"> | string
    commodityId?: StringWithAggregatesFilter<"MandiPrice"> | string
    marketId?: StringWithAggregatesFilter<"MandiPrice"> | string
    priceMin?: DecimalWithAggregatesFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalWithAggregatesFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalWithAggregatesFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeWithAggregatesFilter<"MandiPrice"> | Date | string
    source?: StringWithAggregatesFilter<"MandiPrice"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MandiPrice"> | Date | string
  }

  export type RecommendationWhereInput = {
    AND?: RecommendationWhereInput | RecommendationWhereInput[]
    OR?: RecommendationWhereInput[]
    NOT?: RecommendationWhereInput | RecommendationWhereInput[]
    id?: StringFilter<"Recommendation"> | string
    commodityId?: StringFilter<"Recommendation"> | string
    sourceRegion?: StringFilter<"Recommendation"> | string
    targetMarket?: StringFilter<"Recommendation"> | string
    action?: EnumRecommendationActionFilter<"Recommendation"> | $Enums.RecommendationAction
    confidence?: DecimalFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: DecimalNullableFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: DecimalNullableFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonFilter<"Recommendation">
    assumptions?: JsonFilter<"Recommendation">
    payload?: JsonFilter<"Recommendation">
    validUntil?: DateTimeFilter<"Recommendation"> | Date | string
    createdByAgent?: StringFilter<"Recommendation"> | string
    createdAt?: DateTimeFilter<"Recommendation"> | Date | string
    commodity?: XOR<CommodityRelationFilter, CommodityWhereInput>
    outcomes?: RecommendationOutcomeListRelationFilter
  }

  export type RecommendationOrderByWithRelationInput = {
    id?: SortOrder
    commodityId?: SortOrder
    sourceRegion?: SortOrder
    targetMarket?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    expectedMarginMin?: SortOrderInput | SortOrder
    expectedMarginMax?: SortOrderInput | SortOrder
    riskFlags?: SortOrder
    assumptions?: SortOrder
    payload?: SortOrder
    validUntil?: SortOrder
    createdByAgent?: SortOrder
    createdAt?: SortOrder
    commodity?: CommodityOrderByWithRelationInput
    outcomes?: RecommendationOutcomeOrderByRelationAggregateInput
  }

  export type RecommendationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RecommendationWhereInput | RecommendationWhereInput[]
    OR?: RecommendationWhereInput[]
    NOT?: RecommendationWhereInput | RecommendationWhereInput[]
    commodityId?: StringFilter<"Recommendation"> | string
    sourceRegion?: StringFilter<"Recommendation"> | string
    targetMarket?: StringFilter<"Recommendation"> | string
    action?: EnumRecommendationActionFilter<"Recommendation"> | $Enums.RecommendationAction
    confidence?: DecimalFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: DecimalNullableFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: DecimalNullableFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonFilter<"Recommendation">
    assumptions?: JsonFilter<"Recommendation">
    payload?: JsonFilter<"Recommendation">
    validUntil?: DateTimeFilter<"Recommendation"> | Date | string
    createdByAgent?: StringFilter<"Recommendation"> | string
    createdAt?: DateTimeFilter<"Recommendation"> | Date | string
    commodity?: XOR<CommodityRelationFilter, CommodityWhereInput>
    outcomes?: RecommendationOutcomeListRelationFilter
  }, "id">

  export type RecommendationOrderByWithAggregationInput = {
    id?: SortOrder
    commodityId?: SortOrder
    sourceRegion?: SortOrder
    targetMarket?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    expectedMarginMin?: SortOrderInput | SortOrder
    expectedMarginMax?: SortOrderInput | SortOrder
    riskFlags?: SortOrder
    assumptions?: SortOrder
    payload?: SortOrder
    validUntil?: SortOrder
    createdByAgent?: SortOrder
    createdAt?: SortOrder
    _count?: RecommendationCountOrderByAggregateInput
    _avg?: RecommendationAvgOrderByAggregateInput
    _max?: RecommendationMaxOrderByAggregateInput
    _min?: RecommendationMinOrderByAggregateInput
    _sum?: RecommendationSumOrderByAggregateInput
  }

  export type RecommendationScalarWhereWithAggregatesInput = {
    AND?: RecommendationScalarWhereWithAggregatesInput | RecommendationScalarWhereWithAggregatesInput[]
    OR?: RecommendationScalarWhereWithAggregatesInput[]
    NOT?: RecommendationScalarWhereWithAggregatesInput | RecommendationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Recommendation"> | string
    commodityId?: StringWithAggregatesFilter<"Recommendation"> | string
    sourceRegion?: StringWithAggregatesFilter<"Recommendation"> | string
    targetMarket?: StringWithAggregatesFilter<"Recommendation"> | string
    action?: EnumRecommendationActionWithAggregatesFilter<"Recommendation"> | $Enums.RecommendationAction
    confidence?: DecimalWithAggregatesFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: DecimalNullableWithAggregatesFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: DecimalNullableWithAggregatesFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonWithAggregatesFilter<"Recommendation">
    assumptions?: JsonWithAggregatesFilter<"Recommendation">
    payload?: JsonWithAggregatesFilter<"Recommendation">
    validUntil?: DateTimeWithAggregatesFilter<"Recommendation"> | Date | string
    createdByAgent?: StringWithAggregatesFilter<"Recommendation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Recommendation"> | Date | string
  }

  export type WeatherSnapshotWhereInput = {
    AND?: WeatherSnapshotWhereInput | WeatherSnapshotWhereInput[]
    OR?: WeatherSnapshotWhereInput[]
    NOT?: WeatherSnapshotWhereInput | WeatherSnapshotWhereInput[]
    id?: StringFilter<"WeatherSnapshot"> | string
    region?: StringFilter<"WeatherSnapshot"> | string
    forecastDate?: DateTimeFilter<"WeatherSnapshot"> | Date | string
    maxTempC?: DecimalNullableFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    minTempC?: DecimalNullableFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    humidityPct?: DecimalNullableFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    rainfallMm?: DecimalNullableFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    riskLevel?: EnumRiskLevelFilter<"WeatherSnapshot"> | $Enums.RiskLevel
    source?: StringFilter<"WeatherSnapshot"> | string
    createdAt?: DateTimeFilter<"WeatherSnapshot"> | Date | string
  }

  export type WeatherSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    region?: SortOrder
    forecastDate?: SortOrder
    maxTempC?: SortOrderInput | SortOrder
    minTempC?: SortOrderInput | SortOrder
    humidityPct?: SortOrderInput | SortOrder
    rainfallMm?: SortOrderInput | SortOrder
    riskLevel?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type WeatherSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WeatherSnapshotWhereInput | WeatherSnapshotWhereInput[]
    OR?: WeatherSnapshotWhereInput[]
    NOT?: WeatherSnapshotWhereInput | WeatherSnapshotWhereInput[]
    region?: StringFilter<"WeatherSnapshot"> | string
    forecastDate?: DateTimeFilter<"WeatherSnapshot"> | Date | string
    maxTempC?: DecimalNullableFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    minTempC?: DecimalNullableFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    humidityPct?: DecimalNullableFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    rainfallMm?: DecimalNullableFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    riskLevel?: EnumRiskLevelFilter<"WeatherSnapshot"> | $Enums.RiskLevel
    source?: StringFilter<"WeatherSnapshot"> | string
    createdAt?: DateTimeFilter<"WeatherSnapshot"> | Date | string
  }, "id">

  export type WeatherSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    region?: SortOrder
    forecastDate?: SortOrder
    maxTempC?: SortOrderInput | SortOrder
    minTempC?: SortOrderInput | SortOrder
    humidityPct?: SortOrderInput | SortOrder
    rainfallMm?: SortOrderInput | SortOrder
    riskLevel?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    _count?: WeatherSnapshotCountOrderByAggregateInput
    _avg?: WeatherSnapshotAvgOrderByAggregateInput
    _max?: WeatherSnapshotMaxOrderByAggregateInput
    _min?: WeatherSnapshotMinOrderByAggregateInput
    _sum?: WeatherSnapshotSumOrderByAggregateInput
  }

  export type WeatherSnapshotScalarWhereWithAggregatesInput = {
    AND?: WeatherSnapshotScalarWhereWithAggregatesInput | WeatherSnapshotScalarWhereWithAggregatesInput[]
    OR?: WeatherSnapshotScalarWhereWithAggregatesInput[]
    NOT?: WeatherSnapshotScalarWhereWithAggregatesInput | WeatherSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WeatherSnapshot"> | string
    region?: StringWithAggregatesFilter<"WeatherSnapshot"> | string
    forecastDate?: DateTimeWithAggregatesFilter<"WeatherSnapshot"> | Date | string
    maxTempC?: DecimalNullableWithAggregatesFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    minTempC?: DecimalNullableWithAggregatesFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    humidityPct?: DecimalNullableWithAggregatesFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    rainfallMm?: DecimalNullableWithAggregatesFilter<"WeatherSnapshot"> | Decimal | DecimalJsLike | number | string | null
    riskLevel?: EnumRiskLevelWithAggregatesFilter<"WeatherSnapshot"> | $Enums.RiskLevel
    source?: StringWithAggregatesFilter<"WeatherSnapshot"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WeatherSnapshot"> | Date | string
  }

  export type QualitySpecWhereInput = {
    AND?: QualitySpecWhereInput | QualitySpecWhereInput[]
    OR?: QualitySpecWhereInput[]
    NOT?: QualitySpecWhereInput | QualitySpecWhereInput[]
    id?: StringFilter<"QualitySpec"> | string
    commodityId?: StringFilter<"QualitySpec"> | string
    grade?: StringFilter<"QualitySpec"> | string
    parameter?: StringFilter<"QualitySpec"> | string
    minValue?: StringNullableFilter<"QualitySpec"> | string | null
    maxValue?: StringNullableFilter<"QualitySpec"> | string | null
    checklistNote?: StringNullableFilter<"QualitySpec"> | string | null
    createdAt?: DateTimeFilter<"QualitySpec"> | Date | string
    commodity?: XOR<CommodityRelationFilter, CommodityWhereInput>
  }

  export type QualitySpecOrderByWithRelationInput = {
    id?: SortOrder
    commodityId?: SortOrder
    grade?: SortOrder
    parameter?: SortOrder
    minValue?: SortOrderInput | SortOrder
    maxValue?: SortOrderInput | SortOrder
    checklistNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    commodity?: CommodityOrderByWithRelationInput
  }

  export type QualitySpecWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QualitySpecWhereInput | QualitySpecWhereInput[]
    OR?: QualitySpecWhereInput[]
    NOT?: QualitySpecWhereInput | QualitySpecWhereInput[]
    commodityId?: StringFilter<"QualitySpec"> | string
    grade?: StringFilter<"QualitySpec"> | string
    parameter?: StringFilter<"QualitySpec"> | string
    minValue?: StringNullableFilter<"QualitySpec"> | string | null
    maxValue?: StringNullableFilter<"QualitySpec"> | string | null
    checklistNote?: StringNullableFilter<"QualitySpec"> | string | null
    createdAt?: DateTimeFilter<"QualitySpec"> | Date | string
    commodity?: XOR<CommodityRelationFilter, CommodityWhereInput>
  }, "id">

  export type QualitySpecOrderByWithAggregationInput = {
    id?: SortOrder
    commodityId?: SortOrder
    grade?: SortOrder
    parameter?: SortOrder
    minValue?: SortOrderInput | SortOrder
    maxValue?: SortOrderInput | SortOrder
    checklistNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: QualitySpecCountOrderByAggregateInput
    _max?: QualitySpecMaxOrderByAggregateInput
    _min?: QualitySpecMinOrderByAggregateInput
  }

  export type QualitySpecScalarWhereWithAggregatesInput = {
    AND?: QualitySpecScalarWhereWithAggregatesInput | QualitySpecScalarWhereWithAggregatesInput[]
    OR?: QualitySpecScalarWhereWithAggregatesInput[]
    NOT?: QualitySpecScalarWhereWithAggregatesInput | QualitySpecScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QualitySpec"> | string
    commodityId?: StringWithAggregatesFilter<"QualitySpec"> | string
    grade?: StringWithAggregatesFilter<"QualitySpec"> | string
    parameter?: StringWithAggregatesFilter<"QualitySpec"> | string
    minValue?: StringNullableWithAggregatesFilter<"QualitySpec"> | string | null
    maxValue?: StringNullableWithAggregatesFilter<"QualitySpec"> | string | null
    checklistNote?: StringNullableWithAggregatesFilter<"QualitySpec"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"QualitySpec"> | Date | string
  }

  export type StorageProfileWhereInput = {
    AND?: StorageProfileWhereInput | StorageProfileWhereInput[]
    OR?: StorageProfileWhereInput[]
    NOT?: StorageProfileWhereInput | StorageProfileWhereInput[]
    id?: StringFilter<"StorageProfile"> | string
    commodityId?: StringFilter<"StorageProfile"> | string
    mode?: EnumStorageModeFilter<"StorageProfile"> | $Enums.StorageMode
    tempRange?: StringNullableFilter<"StorageProfile"> | string | null
    humidityRange?: StringNullableFilter<"StorageProfile"> | string | null
    maxDays?: IntFilter<"StorageProfile"> | number
    spoilageRiskNote?: StringNullableFilter<"StorageProfile"> | string | null
    createdAt?: DateTimeFilter<"StorageProfile"> | Date | string
    commodity?: XOR<CommodityRelationFilter, CommodityWhereInput>
  }

  export type StorageProfileOrderByWithRelationInput = {
    id?: SortOrder
    commodityId?: SortOrder
    mode?: SortOrder
    tempRange?: SortOrderInput | SortOrder
    humidityRange?: SortOrderInput | SortOrder
    maxDays?: SortOrder
    spoilageRiskNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    commodity?: CommodityOrderByWithRelationInput
  }

  export type StorageProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StorageProfileWhereInput | StorageProfileWhereInput[]
    OR?: StorageProfileWhereInput[]
    NOT?: StorageProfileWhereInput | StorageProfileWhereInput[]
    commodityId?: StringFilter<"StorageProfile"> | string
    mode?: EnumStorageModeFilter<"StorageProfile"> | $Enums.StorageMode
    tempRange?: StringNullableFilter<"StorageProfile"> | string | null
    humidityRange?: StringNullableFilter<"StorageProfile"> | string | null
    maxDays?: IntFilter<"StorageProfile"> | number
    spoilageRiskNote?: StringNullableFilter<"StorageProfile"> | string | null
    createdAt?: DateTimeFilter<"StorageProfile"> | Date | string
    commodity?: XOR<CommodityRelationFilter, CommodityWhereInput>
  }, "id">

  export type StorageProfileOrderByWithAggregationInput = {
    id?: SortOrder
    commodityId?: SortOrder
    mode?: SortOrder
    tempRange?: SortOrderInput | SortOrder
    humidityRange?: SortOrderInput | SortOrder
    maxDays?: SortOrder
    spoilageRiskNote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StorageProfileCountOrderByAggregateInput
    _avg?: StorageProfileAvgOrderByAggregateInput
    _max?: StorageProfileMaxOrderByAggregateInput
    _min?: StorageProfileMinOrderByAggregateInput
    _sum?: StorageProfileSumOrderByAggregateInput
  }

  export type StorageProfileScalarWhereWithAggregatesInput = {
    AND?: StorageProfileScalarWhereWithAggregatesInput | StorageProfileScalarWhereWithAggregatesInput[]
    OR?: StorageProfileScalarWhereWithAggregatesInput[]
    NOT?: StorageProfileScalarWhereWithAggregatesInput | StorageProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StorageProfile"> | string
    commodityId?: StringWithAggregatesFilter<"StorageProfile"> | string
    mode?: EnumStorageModeWithAggregatesFilter<"StorageProfile"> | $Enums.StorageMode
    tempRange?: StringNullableWithAggregatesFilter<"StorageProfile"> | string | null
    humidityRange?: StringNullableWithAggregatesFilter<"StorageProfile"> | string | null
    maxDays?: IntWithAggregatesFilter<"StorageProfile"> | number
    spoilageRiskNote?: StringNullableWithAggregatesFilter<"StorageProfile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StorageProfile"> | Date | string
  }

  export type RecommendationOutcomeWhereInput = {
    AND?: RecommendationOutcomeWhereInput | RecommendationOutcomeWhereInput[]
    OR?: RecommendationOutcomeWhereInput[]
    NOT?: RecommendationOutcomeWhereInput | RecommendationOutcomeWhereInput[]
    id?: StringFilter<"RecommendationOutcome"> | string
    recommendationId?: StringFilter<"RecommendationOutcome"> | string
    executed?: BoolFilter<"RecommendationOutcome"> | boolean
    executedQtyTons?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"RecommendationOutcome"> | string | null
    recordedAt?: DateTimeFilter<"RecommendationOutcome"> | Date | string
    recommendation?: XOR<RecommendationRelationFilter, RecommendationWhereInput>
  }

  export type RecommendationOutcomeOrderByWithRelationInput = {
    id?: SortOrder
    recommendationId?: SortOrder
    executed?: SortOrder
    executedQtyTons?: SortOrderInput | SortOrder
    realizedBuyAvg?: SortOrderInput | SortOrder
    realizedSellAvg?: SortOrderInput | SortOrder
    realizedMargin?: SortOrderInput | SortOrder
    spoilagePct?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    recommendation?: RecommendationOrderByWithRelationInput
  }

  export type RecommendationOutcomeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RecommendationOutcomeWhereInput | RecommendationOutcomeWhereInput[]
    OR?: RecommendationOutcomeWhereInput[]
    NOT?: RecommendationOutcomeWhereInput | RecommendationOutcomeWhereInput[]
    recommendationId?: StringFilter<"RecommendationOutcome"> | string
    executed?: BoolFilter<"RecommendationOutcome"> | boolean
    executedQtyTons?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"RecommendationOutcome"> | string | null
    recordedAt?: DateTimeFilter<"RecommendationOutcome"> | Date | string
    recommendation?: XOR<RecommendationRelationFilter, RecommendationWhereInput>
  }, "id">

  export type RecommendationOutcomeOrderByWithAggregationInput = {
    id?: SortOrder
    recommendationId?: SortOrder
    executed?: SortOrder
    executedQtyTons?: SortOrderInput | SortOrder
    realizedBuyAvg?: SortOrderInput | SortOrder
    realizedSellAvg?: SortOrderInput | SortOrder
    realizedMargin?: SortOrderInput | SortOrder
    spoilagePct?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    _count?: RecommendationOutcomeCountOrderByAggregateInput
    _avg?: RecommendationOutcomeAvgOrderByAggregateInput
    _max?: RecommendationOutcomeMaxOrderByAggregateInput
    _min?: RecommendationOutcomeMinOrderByAggregateInput
    _sum?: RecommendationOutcomeSumOrderByAggregateInput
  }

  export type RecommendationOutcomeScalarWhereWithAggregatesInput = {
    AND?: RecommendationOutcomeScalarWhereWithAggregatesInput | RecommendationOutcomeScalarWhereWithAggregatesInput[]
    OR?: RecommendationOutcomeScalarWhereWithAggregatesInput[]
    NOT?: RecommendationOutcomeScalarWhereWithAggregatesInput | RecommendationOutcomeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RecommendationOutcome"> | string
    recommendationId?: StringWithAggregatesFilter<"RecommendationOutcome"> | string
    executed?: BoolWithAggregatesFilter<"RecommendationOutcome"> | boolean
    executedQtyTons?: DecimalNullableWithAggregatesFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: DecimalNullableWithAggregatesFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: DecimalNullableWithAggregatesFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: DecimalNullableWithAggregatesFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: DecimalNullableWithAggregatesFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableWithAggregatesFilter<"RecommendationOutcome"> | string | null
    recordedAt?: DateTimeWithAggregatesFilter<"RecommendationOutcome"> | Date | string
  }

  export type SeoContentJobWhereInput = {
    AND?: SeoContentJobWhereInput | SeoContentJobWhereInput[]
    OR?: SeoContentJobWhereInput[]
    NOT?: SeoContentJobWhereInput | SeoContentJobWhereInput[]
    id?: StringFilter<"SeoContentJob"> | string
    topic?: StringFilter<"SeoContentJob"> | string
    targetPersona?: StringFilter<"SeoContentJob"> | string
    primaryKeyword?: StringFilter<"SeoContentJob"> | string
    secondaryKeywords?: JsonFilter<"SeoContentJob">
    status?: EnumSeoStatusFilter<"SeoContentJob"> | $Enums.SeoStatus
    url?: StringNullableFilter<"SeoContentJob"> | string | null
    impressions?: IntFilter<"SeoContentJob"> | number
    clicks?: IntFilter<"SeoContentJob"> | number
    createdAt?: DateTimeFilter<"SeoContentJob"> | Date | string
  }

  export type SeoContentJobOrderByWithRelationInput = {
    id?: SortOrder
    topic?: SortOrder
    targetPersona?: SortOrder
    primaryKeyword?: SortOrder
    secondaryKeywords?: SortOrder
    status?: SortOrder
    url?: SortOrderInput | SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    createdAt?: SortOrder
  }

  export type SeoContentJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SeoContentJobWhereInput | SeoContentJobWhereInput[]
    OR?: SeoContentJobWhereInput[]
    NOT?: SeoContentJobWhereInput | SeoContentJobWhereInput[]
    topic?: StringFilter<"SeoContentJob"> | string
    targetPersona?: StringFilter<"SeoContentJob"> | string
    primaryKeyword?: StringFilter<"SeoContentJob"> | string
    secondaryKeywords?: JsonFilter<"SeoContentJob">
    status?: EnumSeoStatusFilter<"SeoContentJob"> | $Enums.SeoStatus
    url?: StringNullableFilter<"SeoContentJob"> | string | null
    impressions?: IntFilter<"SeoContentJob"> | number
    clicks?: IntFilter<"SeoContentJob"> | number
    createdAt?: DateTimeFilter<"SeoContentJob"> | Date | string
  }, "id">

  export type SeoContentJobOrderByWithAggregationInput = {
    id?: SortOrder
    topic?: SortOrder
    targetPersona?: SortOrder
    primaryKeyword?: SortOrder
    secondaryKeywords?: SortOrder
    status?: SortOrder
    url?: SortOrderInput | SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    createdAt?: SortOrder
    _count?: SeoContentJobCountOrderByAggregateInput
    _avg?: SeoContentJobAvgOrderByAggregateInput
    _max?: SeoContentJobMaxOrderByAggregateInput
    _min?: SeoContentJobMinOrderByAggregateInput
    _sum?: SeoContentJobSumOrderByAggregateInput
  }

  export type SeoContentJobScalarWhereWithAggregatesInput = {
    AND?: SeoContentJobScalarWhereWithAggregatesInput | SeoContentJobScalarWhereWithAggregatesInput[]
    OR?: SeoContentJobScalarWhereWithAggregatesInput[]
    NOT?: SeoContentJobScalarWhereWithAggregatesInput | SeoContentJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SeoContentJob"> | string
    topic?: StringWithAggregatesFilter<"SeoContentJob"> | string
    targetPersona?: StringWithAggregatesFilter<"SeoContentJob"> | string
    primaryKeyword?: StringWithAggregatesFilter<"SeoContentJob"> | string
    secondaryKeywords?: JsonWithAggregatesFilter<"SeoContentJob">
    status?: EnumSeoStatusWithAggregatesFilter<"SeoContentJob"> | $Enums.SeoStatus
    url?: StringNullableWithAggregatesFilter<"SeoContentJob"> | string | null
    impressions?: IntWithAggregatesFilter<"SeoContentJob"> | number
    clicks?: IntWithAggregatesFilter<"SeoContentJob"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SeoContentJob"> | Date | string
  }

  export type CommodityCreateInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    mandiPrices?: MandiPriceCreateNestedManyWithoutCommodityInput
    recommendations?: RecommendationCreateNestedManyWithoutCommodityInput
    qualitySpecs?: QualitySpecCreateNestedManyWithoutCommodityInput
    storageProfiles?: StorageProfileCreateNestedManyWithoutCommodityInput
  }

  export type CommodityUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    mandiPrices?: MandiPriceUncheckedCreateNestedManyWithoutCommodityInput
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutCommodityInput
    qualitySpecs?: QualitySpecUncheckedCreateNestedManyWithoutCommodityInput
    storageProfiles?: StorageProfileUncheckedCreateNestedManyWithoutCommodityInput
  }

  export type CommodityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUpdateManyWithoutCommodityNestedInput
    recommendations?: RecommendationUpdateManyWithoutCommodityNestedInput
    qualitySpecs?: QualitySpecUpdateManyWithoutCommodityNestedInput
    storageProfiles?: StorageProfileUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUncheckedUpdateManyWithoutCommodityNestedInput
    recommendations?: RecommendationUncheckedUpdateManyWithoutCommodityNestedInput
    qualitySpecs?: QualitySpecUncheckedUpdateManyWithoutCommodityNestedInput
    storageProfiles?: StorageProfileUncheckedUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityCreateManyInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
  }

  export type CommodityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommodityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketCreateInput = {
    id?: string
    name: string
    region: string
    type: $Enums.MarketType
    createdAt?: Date | string
    mandiPrices?: MandiPriceCreateNestedManyWithoutMarketInput
  }

  export type MarketUncheckedCreateInput = {
    id?: string
    name: string
    region: string
    type: $Enums.MarketType
    createdAt?: Date | string
    mandiPrices?: MandiPriceUncheckedCreateNestedManyWithoutMarketInput
  }

  export type MarketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    type?: EnumMarketTypeFieldUpdateOperationsInput | $Enums.MarketType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUpdateManyWithoutMarketNestedInput
  }

  export type MarketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    type?: EnumMarketTypeFieldUpdateOperationsInput | $Enums.MarketType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUncheckedUpdateManyWithoutMarketNestedInput
  }

  export type MarketCreateManyInput = {
    id?: string
    name: string
    region: string
    type: $Enums.MarketType
    createdAt?: Date | string
  }

  export type MarketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    type?: EnumMarketTypeFieldUpdateOperationsInput | $Enums.MarketType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    type?: EnumMarketTypeFieldUpdateOperationsInput | $Enums.MarketType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MandiPriceCreateInput = {
    id?: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
    commodity: CommodityCreateNestedOneWithoutMandiPricesInput
    market: MarketCreateNestedOneWithoutMandiPricesInput
  }

  export type MandiPriceUncheckedCreateInput = {
    id?: string
    commodityId: string
    marketId: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
  }

  export type MandiPriceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: CommodityUpdateOneRequiredWithoutMandiPricesNestedInput
    market?: MarketUpdateOneRequiredWithoutMandiPricesNestedInput
  }

  export type MandiPriceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    marketId?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MandiPriceCreateManyInput = {
    id?: string
    commodityId: string
    marketId: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
  }

  export type MandiPriceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MandiPriceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    marketId?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationCreateInput = {
    id?: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal | DecimalJsLike | number | string
    expectedMarginMin?: Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: Decimal | DecimalJsLike | number | string | null
    riskFlags: JsonNullValueInput | InputJsonValue
    assumptions: JsonNullValueInput | InputJsonValue
    payload: JsonNullValueInput | InputJsonValue
    validUntil: Date | string
    createdByAgent: string
    createdAt?: Date | string
    commodity: CommodityCreateNestedOneWithoutRecommendationsInput
    outcomes?: RecommendationOutcomeCreateNestedManyWithoutRecommendationInput
  }

  export type RecommendationUncheckedCreateInput = {
    id?: string
    commodityId: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal | DecimalJsLike | number | string
    expectedMarginMin?: Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: Decimal | DecimalJsLike | number | string | null
    riskFlags: JsonNullValueInput | InputJsonValue
    assumptions: JsonNullValueInput | InputJsonValue
    payload: JsonNullValueInput | InputJsonValue
    validUntil: Date | string
    createdByAgent: string
    createdAt?: Date | string
    outcomes?: RecommendationOutcomeUncheckedCreateNestedManyWithoutRecommendationInput
  }

  export type RecommendationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: CommodityUpdateOneRequiredWithoutRecommendationsNestedInput
    outcomes?: RecommendationOutcomeUpdateManyWithoutRecommendationNestedInput
  }

  export type RecommendationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outcomes?: RecommendationOutcomeUncheckedUpdateManyWithoutRecommendationNestedInput
  }

  export type RecommendationCreateManyInput = {
    id?: string
    commodityId: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal | DecimalJsLike | number | string
    expectedMarginMin?: Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: Decimal | DecimalJsLike | number | string | null
    riskFlags: JsonNullValueInput | InputJsonValue
    assumptions: JsonNullValueInput | InputJsonValue
    payload: JsonNullValueInput | InputJsonValue
    validUntil: Date | string
    createdByAgent: string
    createdAt?: Date | string
  }

  export type RecommendationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeatherSnapshotCreateInput = {
    id?: string
    region: string
    forecastDate: Date | string
    maxTempC?: Decimal | DecimalJsLike | number | string | null
    minTempC?: Decimal | DecimalJsLike | number | string | null
    humidityPct?: Decimal | DecimalJsLike | number | string | null
    rainfallMm?: Decimal | DecimalJsLike | number | string | null
    riskLevel: $Enums.RiskLevel
    source: string
    createdAt?: Date | string
  }

  export type WeatherSnapshotUncheckedCreateInput = {
    id?: string
    region: string
    forecastDate: Date | string
    maxTempC?: Decimal | DecimalJsLike | number | string | null
    minTempC?: Decimal | DecimalJsLike | number | string | null
    humidityPct?: Decimal | DecimalJsLike | number | string | null
    rainfallMm?: Decimal | DecimalJsLike | number | string | null
    riskLevel: $Enums.RiskLevel
    source: string
    createdAt?: Date | string
  }

  export type WeatherSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    forecastDate?: DateTimeFieldUpdateOperationsInput | Date | string
    maxTempC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minTempC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    humidityPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rainfallMm?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeatherSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    forecastDate?: DateTimeFieldUpdateOperationsInput | Date | string
    maxTempC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minTempC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    humidityPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rainfallMm?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeatherSnapshotCreateManyInput = {
    id?: string
    region: string
    forecastDate: Date | string
    maxTempC?: Decimal | DecimalJsLike | number | string | null
    minTempC?: Decimal | DecimalJsLike | number | string | null
    humidityPct?: Decimal | DecimalJsLike | number | string | null
    rainfallMm?: Decimal | DecimalJsLike | number | string | null
    riskLevel: $Enums.RiskLevel
    source: string
    createdAt?: Date | string
  }

  export type WeatherSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    forecastDate?: DateTimeFieldUpdateOperationsInput | Date | string
    maxTempC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minTempC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    humidityPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rainfallMm?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WeatherSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    forecastDate?: DateTimeFieldUpdateOperationsInput | Date | string
    maxTempC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minTempC?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    humidityPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    rainfallMm?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskLevel?: EnumRiskLevelFieldUpdateOperationsInput | $Enums.RiskLevel
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QualitySpecCreateInput = {
    id?: string
    grade: string
    parameter: string
    minValue?: string | null
    maxValue?: string | null
    checklistNote?: string | null
    createdAt?: Date | string
    commodity: CommodityCreateNestedOneWithoutQualitySpecsInput
  }

  export type QualitySpecUncheckedCreateInput = {
    id?: string
    commodityId: string
    grade: string
    parameter: string
    minValue?: string | null
    maxValue?: string | null
    checklistNote?: string | null
    createdAt?: Date | string
  }

  export type QualitySpecUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    parameter?: StringFieldUpdateOperationsInput | string
    minValue?: NullableStringFieldUpdateOperationsInput | string | null
    maxValue?: NullableStringFieldUpdateOperationsInput | string | null
    checklistNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: CommodityUpdateOneRequiredWithoutQualitySpecsNestedInput
  }

  export type QualitySpecUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    parameter?: StringFieldUpdateOperationsInput | string
    minValue?: NullableStringFieldUpdateOperationsInput | string | null
    maxValue?: NullableStringFieldUpdateOperationsInput | string | null
    checklistNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QualitySpecCreateManyInput = {
    id?: string
    commodityId: string
    grade: string
    parameter: string
    minValue?: string | null
    maxValue?: string | null
    checklistNote?: string | null
    createdAt?: Date | string
  }

  export type QualitySpecUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    parameter?: StringFieldUpdateOperationsInput | string
    minValue?: NullableStringFieldUpdateOperationsInput | string | null
    maxValue?: NullableStringFieldUpdateOperationsInput | string | null
    checklistNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QualitySpecUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    parameter?: StringFieldUpdateOperationsInput | string
    minValue?: NullableStringFieldUpdateOperationsInput | string | null
    maxValue?: NullableStringFieldUpdateOperationsInput | string | null
    checklistNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageProfileCreateInput = {
    id?: string
    mode: $Enums.StorageMode
    tempRange?: string | null
    humidityRange?: string | null
    maxDays: number
    spoilageRiskNote?: string | null
    createdAt?: Date | string
    commodity: CommodityCreateNestedOneWithoutStorageProfilesInput
  }

  export type StorageProfileUncheckedCreateInput = {
    id?: string
    commodityId: string
    mode: $Enums.StorageMode
    tempRange?: string | null
    humidityRange?: string | null
    maxDays: number
    spoilageRiskNote?: string | null
    createdAt?: Date | string
  }

  export type StorageProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumStorageModeFieldUpdateOperationsInput | $Enums.StorageMode
    tempRange?: NullableStringFieldUpdateOperationsInput | string | null
    humidityRange?: NullableStringFieldUpdateOperationsInput | string | null
    maxDays?: IntFieldUpdateOperationsInput | number
    spoilageRiskNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: CommodityUpdateOneRequiredWithoutStorageProfilesNestedInput
  }

  export type StorageProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    mode?: EnumStorageModeFieldUpdateOperationsInput | $Enums.StorageMode
    tempRange?: NullableStringFieldUpdateOperationsInput | string | null
    humidityRange?: NullableStringFieldUpdateOperationsInput | string | null
    maxDays?: IntFieldUpdateOperationsInput | number
    spoilageRiskNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageProfileCreateManyInput = {
    id?: string
    commodityId: string
    mode: $Enums.StorageMode
    tempRange?: string | null
    humidityRange?: string | null
    maxDays: number
    spoilageRiskNote?: string | null
    createdAt?: Date | string
  }

  export type StorageProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumStorageModeFieldUpdateOperationsInput | $Enums.StorageMode
    tempRange?: NullableStringFieldUpdateOperationsInput | string | null
    humidityRange?: NullableStringFieldUpdateOperationsInput | string | null
    maxDays?: IntFieldUpdateOperationsInput | number
    spoilageRiskNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    mode?: EnumStorageModeFieldUpdateOperationsInput | $Enums.StorageMode
    tempRange?: NullableStringFieldUpdateOperationsInput | string | null
    humidityRange?: NullableStringFieldUpdateOperationsInput | string | null
    maxDays?: IntFieldUpdateOperationsInput | number
    spoilageRiskNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationOutcomeCreateInput = {
    id?: string
    executed?: boolean
    executedQtyTons?: Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: Decimal | DecimalJsLike | number | string | null
    realizedMargin?: Decimal | DecimalJsLike | number | string | null
    spoilagePct?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    recordedAt?: Date | string
    recommendation: RecommendationCreateNestedOneWithoutOutcomesInput
  }

  export type RecommendationOutcomeUncheckedCreateInput = {
    id?: string
    recommendationId: string
    executed?: boolean
    executedQtyTons?: Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: Decimal | DecimalJsLike | number | string | null
    realizedMargin?: Decimal | DecimalJsLike | number | string | null
    spoilagePct?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    recordedAt?: Date | string
  }

  export type RecommendationOutcomeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed?: BoolFieldUpdateOperationsInput | boolean
    executedQtyTons?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recommendation?: RecommendationUpdateOneRequiredWithoutOutcomesNestedInput
  }

  export type RecommendationOutcomeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recommendationId?: StringFieldUpdateOperationsInput | string
    executed?: BoolFieldUpdateOperationsInput | boolean
    executedQtyTons?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationOutcomeCreateManyInput = {
    id?: string
    recommendationId: string
    executed?: boolean
    executedQtyTons?: Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: Decimal | DecimalJsLike | number | string | null
    realizedMargin?: Decimal | DecimalJsLike | number | string | null
    spoilagePct?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    recordedAt?: Date | string
  }

  export type RecommendationOutcomeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed?: BoolFieldUpdateOperationsInput | boolean
    executedQtyTons?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationOutcomeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    recommendationId?: StringFieldUpdateOperationsInput | string
    executed?: BoolFieldUpdateOperationsInput | boolean
    executedQtyTons?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeoContentJobCreateInput = {
    id?: string
    topic: string
    targetPersona: string
    primaryKeyword: string
    secondaryKeywords: JsonNullValueInput | InputJsonValue
    status?: $Enums.SeoStatus
    url?: string | null
    impressions?: number
    clicks?: number
    createdAt?: Date | string
  }

  export type SeoContentJobUncheckedCreateInput = {
    id?: string
    topic: string
    targetPersona: string
    primaryKeyword: string
    secondaryKeywords: JsonNullValueInput | InputJsonValue
    status?: $Enums.SeoStatus
    url?: string | null
    impressions?: number
    clicks?: number
    createdAt?: Date | string
  }

  export type SeoContentJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    targetPersona?: StringFieldUpdateOperationsInput | string
    primaryKeyword?: StringFieldUpdateOperationsInput | string
    secondaryKeywords?: JsonNullValueInput | InputJsonValue
    status?: EnumSeoStatusFieldUpdateOperationsInput | $Enums.SeoStatus
    url?: NullableStringFieldUpdateOperationsInput | string | null
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeoContentJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    targetPersona?: StringFieldUpdateOperationsInput | string
    primaryKeyword?: StringFieldUpdateOperationsInput | string
    secondaryKeywords?: JsonNullValueInput | InputJsonValue
    status?: EnumSeoStatusFieldUpdateOperationsInput | $Enums.SeoStatus
    url?: NullableStringFieldUpdateOperationsInput | string | null
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeoContentJobCreateManyInput = {
    id?: string
    topic: string
    targetPersona: string
    primaryKeyword: string
    secondaryKeywords: JsonNullValueInput | InputJsonValue
    status?: $Enums.SeoStatus
    url?: string | null
    impressions?: number
    clicks?: number
    createdAt?: Date | string
  }

  export type SeoContentJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    targetPersona?: StringFieldUpdateOperationsInput | string
    primaryKeyword?: StringFieldUpdateOperationsInput | string
    secondaryKeywords?: JsonNullValueInput | InputJsonValue
    status?: EnumSeoStatusFieldUpdateOperationsInput | $Enums.SeoStatus
    url?: NullableStringFieldUpdateOperationsInput | string | null
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeoContentJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    targetPersona?: StringFieldUpdateOperationsInput | string
    primaryKeyword?: StringFieldUpdateOperationsInput | string
    secondaryKeywords?: JsonNullValueInput | InputJsonValue
    status?: EnumSeoStatusFieldUpdateOperationsInput | $Enums.SeoStatus
    url?: NullableStringFieldUpdateOperationsInput | string | null
    impressions?: IntFieldUpdateOperationsInput | number
    clicks?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MandiPriceListRelationFilter = {
    every?: MandiPriceWhereInput
    some?: MandiPriceWhereInput
    none?: MandiPriceWhereInput
  }

  export type RecommendationListRelationFilter = {
    every?: RecommendationWhereInput
    some?: RecommendationWhereInput
    none?: RecommendationWhereInput
  }

  export type QualitySpecListRelationFilter = {
    every?: QualitySpecWhereInput
    some?: QualitySpecWhereInput
    none?: QualitySpecWhereInput
  }

  export type StorageProfileListRelationFilter = {
    every?: StorageProfileWhereInput
    some?: StorageProfileWhereInput
    none?: StorageProfileWhereInput
  }

  export type MandiPriceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RecommendationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QualitySpecOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StorageProfileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommodityCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrder
    defaultShelfLifeDays?: SortOrder
    createdAt?: SortOrder
  }

  export type CommodityAvgOrderByAggregateInput = {
    defaultShelfLifeDays?: SortOrder
  }

  export type CommodityMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrder
    defaultShelfLifeDays?: SortOrder
    createdAt?: SortOrder
  }

  export type CommodityMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrder
    defaultShelfLifeDays?: SortOrder
    createdAt?: SortOrder
  }

  export type CommoditySumOrderByAggregateInput = {
    defaultShelfLifeDays?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumMarketTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketType | EnumMarketTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MarketType[] | ListEnumMarketTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketType[] | ListEnumMarketTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketTypeFilter<$PrismaModel> | $Enums.MarketType
  }

  export type MarketCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    region?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type MarketMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    region?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type MarketMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    region?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMarketTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketType | EnumMarketTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MarketType[] | ListEnumMarketTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketType[] | ListEnumMarketTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketTypeWithAggregatesFilter<$PrismaModel> | $Enums.MarketType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMarketTypeFilter<$PrismaModel>
    _max?: NestedEnumMarketTypeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type CommodityRelationFilter = {
    is?: CommodityWhereInput
    isNot?: CommodityWhereInput
  }

  export type MarketRelationFilter = {
    is?: MarketWhereInput
    isNot?: MarketWhereInput
  }

  export type MandiPriceCountOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    marketId?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceModal?: SortOrder
    observedAt?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type MandiPriceAvgOrderByAggregateInput = {
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceModal?: SortOrder
  }

  export type MandiPriceMaxOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    marketId?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceModal?: SortOrder
    observedAt?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type MandiPriceMinOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    marketId?: SortOrder
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceModal?: SortOrder
    observedAt?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type MandiPriceSumOrderByAggregateInput = {
    priceMin?: SortOrder
    priceMax?: SortOrder
    priceModal?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumRecommendationActionFilter<$PrismaModel = never> = {
    equals?: $Enums.RecommendationAction | EnumRecommendationActionFieldRefInput<$PrismaModel>
    in?: $Enums.RecommendationAction[] | ListEnumRecommendationActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecommendationAction[] | ListEnumRecommendationActionFieldRefInput<$PrismaModel>
    not?: NestedEnumRecommendationActionFilter<$PrismaModel> | $Enums.RecommendationAction
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RecommendationOutcomeListRelationFilter = {
    every?: RecommendationOutcomeWhereInput
    some?: RecommendationOutcomeWhereInput
    none?: RecommendationOutcomeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RecommendationOutcomeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RecommendationCountOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    sourceRegion?: SortOrder
    targetMarket?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    expectedMarginMin?: SortOrder
    expectedMarginMax?: SortOrder
    riskFlags?: SortOrder
    assumptions?: SortOrder
    payload?: SortOrder
    validUntil?: SortOrder
    createdByAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationAvgOrderByAggregateInput = {
    confidence?: SortOrder
    expectedMarginMin?: SortOrder
    expectedMarginMax?: SortOrder
  }

  export type RecommendationMaxOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    sourceRegion?: SortOrder
    targetMarket?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    expectedMarginMin?: SortOrder
    expectedMarginMax?: SortOrder
    validUntil?: SortOrder
    createdByAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationMinOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    sourceRegion?: SortOrder
    targetMarket?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    expectedMarginMin?: SortOrder
    expectedMarginMax?: SortOrder
    validUntil?: SortOrder
    createdByAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type RecommendationSumOrderByAggregateInput = {
    confidence?: SortOrder
    expectedMarginMin?: SortOrder
    expectedMarginMax?: SortOrder
  }

  export type EnumRecommendationActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecommendationAction | EnumRecommendationActionFieldRefInput<$PrismaModel>
    in?: $Enums.RecommendationAction[] | ListEnumRecommendationActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecommendationAction[] | ListEnumRecommendationActionFieldRefInput<$PrismaModel>
    not?: NestedEnumRecommendationActionWithAggregatesFilter<$PrismaModel> | $Enums.RecommendationAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRecommendationActionFilter<$PrismaModel>
    _max?: NestedEnumRecommendationActionFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumRiskLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelFilter<$PrismaModel> | $Enums.RiskLevel
  }

  export type WeatherSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    region?: SortOrder
    forecastDate?: SortOrder
    maxTempC?: SortOrder
    minTempC?: SortOrder
    humidityPct?: SortOrder
    rainfallMm?: SortOrder
    riskLevel?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type WeatherSnapshotAvgOrderByAggregateInput = {
    maxTempC?: SortOrder
    minTempC?: SortOrder
    humidityPct?: SortOrder
    rainfallMm?: SortOrder
  }

  export type WeatherSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    region?: SortOrder
    forecastDate?: SortOrder
    maxTempC?: SortOrder
    minTempC?: SortOrder
    humidityPct?: SortOrder
    rainfallMm?: SortOrder
    riskLevel?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type WeatherSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    region?: SortOrder
    forecastDate?: SortOrder
    maxTempC?: SortOrder
    minTempC?: SortOrder
    humidityPct?: SortOrder
    rainfallMm?: SortOrder
    riskLevel?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type WeatherSnapshotSumOrderByAggregateInput = {
    maxTempC?: SortOrder
    minTempC?: SortOrder
    humidityPct?: SortOrder
    rainfallMm?: SortOrder
  }

  export type EnumRiskLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel> | $Enums.RiskLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRiskLevelFilter<$PrismaModel>
    _max?: NestedEnumRiskLevelFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type QualitySpecCountOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    grade?: SortOrder
    parameter?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    checklistNote?: SortOrder
    createdAt?: SortOrder
  }

  export type QualitySpecMaxOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    grade?: SortOrder
    parameter?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    checklistNote?: SortOrder
    createdAt?: SortOrder
  }

  export type QualitySpecMinOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    grade?: SortOrder
    parameter?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    checklistNote?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumStorageModeFilter<$PrismaModel = never> = {
    equals?: $Enums.StorageMode | EnumStorageModeFieldRefInput<$PrismaModel>
    in?: $Enums.StorageMode[] | ListEnumStorageModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StorageMode[] | ListEnumStorageModeFieldRefInput<$PrismaModel>
    not?: NestedEnumStorageModeFilter<$PrismaModel> | $Enums.StorageMode
  }

  export type StorageProfileCountOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    mode?: SortOrder
    tempRange?: SortOrder
    humidityRange?: SortOrder
    maxDays?: SortOrder
    spoilageRiskNote?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageProfileAvgOrderByAggregateInput = {
    maxDays?: SortOrder
  }

  export type StorageProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    mode?: SortOrder
    tempRange?: SortOrder
    humidityRange?: SortOrder
    maxDays?: SortOrder
    spoilageRiskNote?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageProfileMinOrderByAggregateInput = {
    id?: SortOrder
    commodityId?: SortOrder
    mode?: SortOrder
    tempRange?: SortOrder
    humidityRange?: SortOrder
    maxDays?: SortOrder
    spoilageRiskNote?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageProfileSumOrderByAggregateInput = {
    maxDays?: SortOrder
  }

  export type EnumStorageModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StorageMode | EnumStorageModeFieldRefInput<$PrismaModel>
    in?: $Enums.StorageMode[] | ListEnumStorageModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StorageMode[] | ListEnumStorageModeFieldRefInput<$PrismaModel>
    not?: NestedEnumStorageModeWithAggregatesFilter<$PrismaModel> | $Enums.StorageMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStorageModeFilter<$PrismaModel>
    _max?: NestedEnumStorageModeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type RecommendationRelationFilter = {
    is?: RecommendationWhereInput
    isNot?: RecommendationWhereInput
  }

  export type RecommendationOutcomeCountOrderByAggregateInput = {
    id?: SortOrder
    recommendationId?: SortOrder
    executed?: SortOrder
    executedQtyTons?: SortOrder
    realizedBuyAvg?: SortOrder
    realizedSellAvg?: SortOrder
    realizedMargin?: SortOrder
    spoilagePct?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
  }

  export type RecommendationOutcomeAvgOrderByAggregateInput = {
    executedQtyTons?: SortOrder
    realizedBuyAvg?: SortOrder
    realizedSellAvg?: SortOrder
    realizedMargin?: SortOrder
    spoilagePct?: SortOrder
  }

  export type RecommendationOutcomeMaxOrderByAggregateInput = {
    id?: SortOrder
    recommendationId?: SortOrder
    executed?: SortOrder
    executedQtyTons?: SortOrder
    realizedBuyAvg?: SortOrder
    realizedSellAvg?: SortOrder
    realizedMargin?: SortOrder
    spoilagePct?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
  }

  export type RecommendationOutcomeMinOrderByAggregateInput = {
    id?: SortOrder
    recommendationId?: SortOrder
    executed?: SortOrder
    executedQtyTons?: SortOrder
    realizedBuyAvg?: SortOrder
    realizedSellAvg?: SortOrder
    realizedMargin?: SortOrder
    spoilagePct?: SortOrder
    notes?: SortOrder
    recordedAt?: SortOrder
  }

  export type RecommendationOutcomeSumOrderByAggregateInput = {
    executedQtyTons?: SortOrder
    realizedBuyAvg?: SortOrder
    realizedSellAvg?: SortOrder
    realizedMargin?: SortOrder
    spoilagePct?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumSeoStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SeoStatus | EnumSeoStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SeoStatus[] | ListEnumSeoStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SeoStatus[] | ListEnumSeoStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSeoStatusFilter<$PrismaModel> | $Enums.SeoStatus
  }

  export type SeoContentJobCountOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    targetPersona?: SortOrder
    primaryKeyword?: SortOrder
    secondaryKeywords?: SortOrder
    status?: SortOrder
    url?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    createdAt?: SortOrder
  }

  export type SeoContentJobAvgOrderByAggregateInput = {
    impressions?: SortOrder
    clicks?: SortOrder
  }

  export type SeoContentJobMaxOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    targetPersona?: SortOrder
    primaryKeyword?: SortOrder
    status?: SortOrder
    url?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    createdAt?: SortOrder
  }

  export type SeoContentJobMinOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    targetPersona?: SortOrder
    primaryKeyword?: SortOrder
    status?: SortOrder
    url?: SortOrder
    impressions?: SortOrder
    clicks?: SortOrder
    createdAt?: SortOrder
  }

  export type SeoContentJobSumOrderByAggregateInput = {
    impressions?: SortOrder
    clicks?: SortOrder
  }

  export type EnumSeoStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SeoStatus | EnumSeoStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SeoStatus[] | ListEnumSeoStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SeoStatus[] | ListEnumSeoStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSeoStatusWithAggregatesFilter<$PrismaModel> | $Enums.SeoStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSeoStatusFilter<$PrismaModel>
    _max?: NestedEnumSeoStatusFilter<$PrismaModel>
  }

  export type MandiPriceCreateNestedManyWithoutCommodityInput = {
    create?: XOR<MandiPriceCreateWithoutCommodityInput, MandiPriceUncheckedCreateWithoutCommodityInput> | MandiPriceCreateWithoutCommodityInput[] | MandiPriceUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: MandiPriceCreateOrConnectWithoutCommodityInput | MandiPriceCreateOrConnectWithoutCommodityInput[]
    createMany?: MandiPriceCreateManyCommodityInputEnvelope
    connect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
  }

  export type RecommendationCreateNestedManyWithoutCommodityInput = {
    create?: XOR<RecommendationCreateWithoutCommodityInput, RecommendationUncheckedCreateWithoutCommodityInput> | RecommendationCreateWithoutCommodityInput[] | RecommendationUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutCommodityInput | RecommendationCreateOrConnectWithoutCommodityInput[]
    createMany?: RecommendationCreateManyCommodityInputEnvelope
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
  }

  export type QualitySpecCreateNestedManyWithoutCommodityInput = {
    create?: XOR<QualitySpecCreateWithoutCommodityInput, QualitySpecUncheckedCreateWithoutCommodityInput> | QualitySpecCreateWithoutCommodityInput[] | QualitySpecUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: QualitySpecCreateOrConnectWithoutCommodityInput | QualitySpecCreateOrConnectWithoutCommodityInput[]
    createMany?: QualitySpecCreateManyCommodityInputEnvelope
    connect?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
  }

  export type StorageProfileCreateNestedManyWithoutCommodityInput = {
    create?: XOR<StorageProfileCreateWithoutCommodityInput, StorageProfileUncheckedCreateWithoutCommodityInput> | StorageProfileCreateWithoutCommodityInput[] | StorageProfileUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: StorageProfileCreateOrConnectWithoutCommodityInput | StorageProfileCreateOrConnectWithoutCommodityInput[]
    createMany?: StorageProfileCreateManyCommodityInputEnvelope
    connect?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
  }

  export type MandiPriceUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: XOR<MandiPriceCreateWithoutCommodityInput, MandiPriceUncheckedCreateWithoutCommodityInput> | MandiPriceCreateWithoutCommodityInput[] | MandiPriceUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: MandiPriceCreateOrConnectWithoutCommodityInput | MandiPriceCreateOrConnectWithoutCommodityInput[]
    createMany?: MandiPriceCreateManyCommodityInputEnvelope
    connect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
  }

  export type RecommendationUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: XOR<RecommendationCreateWithoutCommodityInput, RecommendationUncheckedCreateWithoutCommodityInput> | RecommendationCreateWithoutCommodityInput[] | RecommendationUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutCommodityInput | RecommendationCreateOrConnectWithoutCommodityInput[]
    createMany?: RecommendationCreateManyCommodityInputEnvelope
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
  }

  export type QualitySpecUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: XOR<QualitySpecCreateWithoutCommodityInput, QualitySpecUncheckedCreateWithoutCommodityInput> | QualitySpecCreateWithoutCommodityInput[] | QualitySpecUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: QualitySpecCreateOrConnectWithoutCommodityInput | QualitySpecCreateOrConnectWithoutCommodityInput[]
    createMany?: QualitySpecCreateManyCommodityInputEnvelope
    connect?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
  }

  export type StorageProfileUncheckedCreateNestedManyWithoutCommodityInput = {
    create?: XOR<StorageProfileCreateWithoutCommodityInput, StorageProfileUncheckedCreateWithoutCommodityInput> | StorageProfileCreateWithoutCommodityInput[] | StorageProfileUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: StorageProfileCreateOrConnectWithoutCommodityInput | StorageProfileCreateOrConnectWithoutCommodityInput[]
    createMany?: StorageProfileCreateManyCommodityInputEnvelope
    connect?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MandiPriceUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<MandiPriceCreateWithoutCommodityInput, MandiPriceUncheckedCreateWithoutCommodityInput> | MandiPriceCreateWithoutCommodityInput[] | MandiPriceUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: MandiPriceCreateOrConnectWithoutCommodityInput | MandiPriceCreateOrConnectWithoutCommodityInput[]
    upsert?: MandiPriceUpsertWithWhereUniqueWithoutCommodityInput | MandiPriceUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: MandiPriceCreateManyCommodityInputEnvelope
    set?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    disconnect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    delete?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    connect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    update?: MandiPriceUpdateWithWhereUniqueWithoutCommodityInput | MandiPriceUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: MandiPriceUpdateManyWithWhereWithoutCommodityInput | MandiPriceUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: MandiPriceScalarWhereInput | MandiPriceScalarWhereInput[]
  }

  export type RecommendationUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<RecommendationCreateWithoutCommodityInput, RecommendationUncheckedCreateWithoutCommodityInput> | RecommendationCreateWithoutCommodityInput[] | RecommendationUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutCommodityInput | RecommendationCreateOrConnectWithoutCommodityInput[]
    upsert?: RecommendationUpsertWithWhereUniqueWithoutCommodityInput | RecommendationUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: RecommendationCreateManyCommodityInputEnvelope
    set?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    disconnect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    delete?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    update?: RecommendationUpdateWithWhereUniqueWithoutCommodityInput | RecommendationUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: RecommendationUpdateManyWithWhereWithoutCommodityInput | RecommendationUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
  }

  export type QualitySpecUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<QualitySpecCreateWithoutCommodityInput, QualitySpecUncheckedCreateWithoutCommodityInput> | QualitySpecCreateWithoutCommodityInput[] | QualitySpecUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: QualitySpecCreateOrConnectWithoutCommodityInput | QualitySpecCreateOrConnectWithoutCommodityInput[]
    upsert?: QualitySpecUpsertWithWhereUniqueWithoutCommodityInput | QualitySpecUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: QualitySpecCreateManyCommodityInputEnvelope
    set?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
    disconnect?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
    delete?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
    connect?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
    update?: QualitySpecUpdateWithWhereUniqueWithoutCommodityInput | QualitySpecUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: QualitySpecUpdateManyWithWhereWithoutCommodityInput | QualitySpecUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: QualitySpecScalarWhereInput | QualitySpecScalarWhereInput[]
  }

  export type StorageProfileUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<StorageProfileCreateWithoutCommodityInput, StorageProfileUncheckedCreateWithoutCommodityInput> | StorageProfileCreateWithoutCommodityInput[] | StorageProfileUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: StorageProfileCreateOrConnectWithoutCommodityInput | StorageProfileCreateOrConnectWithoutCommodityInput[]
    upsert?: StorageProfileUpsertWithWhereUniqueWithoutCommodityInput | StorageProfileUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: StorageProfileCreateManyCommodityInputEnvelope
    set?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
    disconnect?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
    delete?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
    connect?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
    update?: StorageProfileUpdateWithWhereUniqueWithoutCommodityInput | StorageProfileUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: StorageProfileUpdateManyWithWhereWithoutCommodityInput | StorageProfileUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: StorageProfileScalarWhereInput | StorageProfileScalarWhereInput[]
  }

  export type MandiPriceUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<MandiPriceCreateWithoutCommodityInput, MandiPriceUncheckedCreateWithoutCommodityInput> | MandiPriceCreateWithoutCommodityInput[] | MandiPriceUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: MandiPriceCreateOrConnectWithoutCommodityInput | MandiPriceCreateOrConnectWithoutCommodityInput[]
    upsert?: MandiPriceUpsertWithWhereUniqueWithoutCommodityInput | MandiPriceUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: MandiPriceCreateManyCommodityInputEnvelope
    set?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    disconnect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    delete?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    connect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    update?: MandiPriceUpdateWithWhereUniqueWithoutCommodityInput | MandiPriceUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: MandiPriceUpdateManyWithWhereWithoutCommodityInput | MandiPriceUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: MandiPriceScalarWhereInput | MandiPriceScalarWhereInput[]
  }

  export type RecommendationUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<RecommendationCreateWithoutCommodityInput, RecommendationUncheckedCreateWithoutCommodityInput> | RecommendationCreateWithoutCommodityInput[] | RecommendationUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: RecommendationCreateOrConnectWithoutCommodityInput | RecommendationCreateOrConnectWithoutCommodityInput[]
    upsert?: RecommendationUpsertWithWhereUniqueWithoutCommodityInput | RecommendationUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: RecommendationCreateManyCommodityInputEnvelope
    set?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    disconnect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    delete?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    connect?: RecommendationWhereUniqueInput | RecommendationWhereUniqueInput[]
    update?: RecommendationUpdateWithWhereUniqueWithoutCommodityInput | RecommendationUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: RecommendationUpdateManyWithWhereWithoutCommodityInput | RecommendationUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
  }

  export type QualitySpecUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<QualitySpecCreateWithoutCommodityInput, QualitySpecUncheckedCreateWithoutCommodityInput> | QualitySpecCreateWithoutCommodityInput[] | QualitySpecUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: QualitySpecCreateOrConnectWithoutCommodityInput | QualitySpecCreateOrConnectWithoutCommodityInput[]
    upsert?: QualitySpecUpsertWithWhereUniqueWithoutCommodityInput | QualitySpecUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: QualitySpecCreateManyCommodityInputEnvelope
    set?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
    disconnect?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
    delete?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
    connect?: QualitySpecWhereUniqueInput | QualitySpecWhereUniqueInput[]
    update?: QualitySpecUpdateWithWhereUniqueWithoutCommodityInput | QualitySpecUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: QualitySpecUpdateManyWithWhereWithoutCommodityInput | QualitySpecUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: QualitySpecScalarWhereInput | QualitySpecScalarWhereInput[]
  }

  export type StorageProfileUncheckedUpdateManyWithoutCommodityNestedInput = {
    create?: XOR<StorageProfileCreateWithoutCommodityInput, StorageProfileUncheckedCreateWithoutCommodityInput> | StorageProfileCreateWithoutCommodityInput[] | StorageProfileUncheckedCreateWithoutCommodityInput[]
    connectOrCreate?: StorageProfileCreateOrConnectWithoutCommodityInput | StorageProfileCreateOrConnectWithoutCommodityInput[]
    upsert?: StorageProfileUpsertWithWhereUniqueWithoutCommodityInput | StorageProfileUpsertWithWhereUniqueWithoutCommodityInput[]
    createMany?: StorageProfileCreateManyCommodityInputEnvelope
    set?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
    disconnect?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
    delete?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
    connect?: StorageProfileWhereUniqueInput | StorageProfileWhereUniqueInput[]
    update?: StorageProfileUpdateWithWhereUniqueWithoutCommodityInput | StorageProfileUpdateWithWhereUniqueWithoutCommodityInput[]
    updateMany?: StorageProfileUpdateManyWithWhereWithoutCommodityInput | StorageProfileUpdateManyWithWhereWithoutCommodityInput[]
    deleteMany?: StorageProfileScalarWhereInput | StorageProfileScalarWhereInput[]
  }

  export type MandiPriceCreateNestedManyWithoutMarketInput = {
    create?: XOR<MandiPriceCreateWithoutMarketInput, MandiPriceUncheckedCreateWithoutMarketInput> | MandiPriceCreateWithoutMarketInput[] | MandiPriceUncheckedCreateWithoutMarketInput[]
    connectOrCreate?: MandiPriceCreateOrConnectWithoutMarketInput | MandiPriceCreateOrConnectWithoutMarketInput[]
    createMany?: MandiPriceCreateManyMarketInputEnvelope
    connect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
  }

  export type MandiPriceUncheckedCreateNestedManyWithoutMarketInput = {
    create?: XOR<MandiPriceCreateWithoutMarketInput, MandiPriceUncheckedCreateWithoutMarketInput> | MandiPriceCreateWithoutMarketInput[] | MandiPriceUncheckedCreateWithoutMarketInput[]
    connectOrCreate?: MandiPriceCreateOrConnectWithoutMarketInput | MandiPriceCreateOrConnectWithoutMarketInput[]
    createMany?: MandiPriceCreateManyMarketInputEnvelope
    connect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
  }

  export type EnumMarketTypeFieldUpdateOperationsInput = {
    set?: $Enums.MarketType
  }

  export type MandiPriceUpdateManyWithoutMarketNestedInput = {
    create?: XOR<MandiPriceCreateWithoutMarketInput, MandiPriceUncheckedCreateWithoutMarketInput> | MandiPriceCreateWithoutMarketInput[] | MandiPriceUncheckedCreateWithoutMarketInput[]
    connectOrCreate?: MandiPriceCreateOrConnectWithoutMarketInput | MandiPriceCreateOrConnectWithoutMarketInput[]
    upsert?: MandiPriceUpsertWithWhereUniqueWithoutMarketInput | MandiPriceUpsertWithWhereUniqueWithoutMarketInput[]
    createMany?: MandiPriceCreateManyMarketInputEnvelope
    set?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    disconnect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    delete?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    connect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    update?: MandiPriceUpdateWithWhereUniqueWithoutMarketInput | MandiPriceUpdateWithWhereUniqueWithoutMarketInput[]
    updateMany?: MandiPriceUpdateManyWithWhereWithoutMarketInput | MandiPriceUpdateManyWithWhereWithoutMarketInput[]
    deleteMany?: MandiPriceScalarWhereInput | MandiPriceScalarWhereInput[]
  }

  export type MandiPriceUncheckedUpdateManyWithoutMarketNestedInput = {
    create?: XOR<MandiPriceCreateWithoutMarketInput, MandiPriceUncheckedCreateWithoutMarketInput> | MandiPriceCreateWithoutMarketInput[] | MandiPriceUncheckedCreateWithoutMarketInput[]
    connectOrCreate?: MandiPriceCreateOrConnectWithoutMarketInput | MandiPriceCreateOrConnectWithoutMarketInput[]
    upsert?: MandiPriceUpsertWithWhereUniqueWithoutMarketInput | MandiPriceUpsertWithWhereUniqueWithoutMarketInput[]
    createMany?: MandiPriceCreateManyMarketInputEnvelope
    set?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    disconnect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    delete?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    connect?: MandiPriceWhereUniqueInput | MandiPriceWhereUniqueInput[]
    update?: MandiPriceUpdateWithWhereUniqueWithoutMarketInput | MandiPriceUpdateWithWhereUniqueWithoutMarketInput[]
    updateMany?: MandiPriceUpdateManyWithWhereWithoutMarketInput | MandiPriceUpdateManyWithWhereWithoutMarketInput[]
    deleteMany?: MandiPriceScalarWhereInput | MandiPriceScalarWhereInput[]
  }

  export type CommodityCreateNestedOneWithoutMandiPricesInput = {
    create?: XOR<CommodityCreateWithoutMandiPricesInput, CommodityUncheckedCreateWithoutMandiPricesInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutMandiPricesInput
    connect?: CommodityWhereUniqueInput
  }

  export type MarketCreateNestedOneWithoutMandiPricesInput = {
    create?: XOR<MarketCreateWithoutMandiPricesInput, MarketUncheckedCreateWithoutMandiPricesInput>
    connectOrCreate?: MarketCreateOrConnectWithoutMandiPricesInput
    connect?: MarketWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type CommodityUpdateOneRequiredWithoutMandiPricesNestedInput = {
    create?: XOR<CommodityCreateWithoutMandiPricesInput, CommodityUncheckedCreateWithoutMandiPricesInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutMandiPricesInput
    upsert?: CommodityUpsertWithoutMandiPricesInput
    connect?: CommodityWhereUniqueInput
    update?: XOR<XOR<CommodityUpdateToOneWithWhereWithoutMandiPricesInput, CommodityUpdateWithoutMandiPricesInput>, CommodityUncheckedUpdateWithoutMandiPricesInput>
  }

  export type MarketUpdateOneRequiredWithoutMandiPricesNestedInput = {
    create?: XOR<MarketCreateWithoutMandiPricesInput, MarketUncheckedCreateWithoutMandiPricesInput>
    connectOrCreate?: MarketCreateOrConnectWithoutMandiPricesInput
    upsert?: MarketUpsertWithoutMandiPricesInput
    connect?: MarketWhereUniqueInput
    update?: XOR<XOR<MarketUpdateToOneWithWhereWithoutMandiPricesInput, MarketUpdateWithoutMandiPricesInput>, MarketUncheckedUpdateWithoutMandiPricesInput>
  }

  export type CommodityCreateNestedOneWithoutRecommendationsInput = {
    create?: XOR<CommodityCreateWithoutRecommendationsInput, CommodityUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutRecommendationsInput
    connect?: CommodityWhereUniqueInput
  }

  export type RecommendationOutcomeCreateNestedManyWithoutRecommendationInput = {
    create?: XOR<RecommendationOutcomeCreateWithoutRecommendationInput, RecommendationOutcomeUncheckedCreateWithoutRecommendationInput> | RecommendationOutcomeCreateWithoutRecommendationInput[] | RecommendationOutcomeUncheckedCreateWithoutRecommendationInput[]
    connectOrCreate?: RecommendationOutcomeCreateOrConnectWithoutRecommendationInput | RecommendationOutcomeCreateOrConnectWithoutRecommendationInput[]
    createMany?: RecommendationOutcomeCreateManyRecommendationInputEnvelope
    connect?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
  }

  export type RecommendationOutcomeUncheckedCreateNestedManyWithoutRecommendationInput = {
    create?: XOR<RecommendationOutcomeCreateWithoutRecommendationInput, RecommendationOutcomeUncheckedCreateWithoutRecommendationInput> | RecommendationOutcomeCreateWithoutRecommendationInput[] | RecommendationOutcomeUncheckedCreateWithoutRecommendationInput[]
    connectOrCreate?: RecommendationOutcomeCreateOrConnectWithoutRecommendationInput | RecommendationOutcomeCreateOrConnectWithoutRecommendationInput[]
    createMany?: RecommendationOutcomeCreateManyRecommendationInputEnvelope
    connect?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
  }

  export type EnumRecommendationActionFieldUpdateOperationsInput = {
    set?: $Enums.RecommendationAction
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type CommodityUpdateOneRequiredWithoutRecommendationsNestedInput = {
    create?: XOR<CommodityCreateWithoutRecommendationsInput, CommodityUncheckedCreateWithoutRecommendationsInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutRecommendationsInput
    upsert?: CommodityUpsertWithoutRecommendationsInput
    connect?: CommodityWhereUniqueInput
    update?: XOR<XOR<CommodityUpdateToOneWithWhereWithoutRecommendationsInput, CommodityUpdateWithoutRecommendationsInput>, CommodityUncheckedUpdateWithoutRecommendationsInput>
  }

  export type RecommendationOutcomeUpdateManyWithoutRecommendationNestedInput = {
    create?: XOR<RecommendationOutcomeCreateWithoutRecommendationInput, RecommendationOutcomeUncheckedCreateWithoutRecommendationInput> | RecommendationOutcomeCreateWithoutRecommendationInput[] | RecommendationOutcomeUncheckedCreateWithoutRecommendationInput[]
    connectOrCreate?: RecommendationOutcomeCreateOrConnectWithoutRecommendationInput | RecommendationOutcomeCreateOrConnectWithoutRecommendationInput[]
    upsert?: RecommendationOutcomeUpsertWithWhereUniqueWithoutRecommendationInput | RecommendationOutcomeUpsertWithWhereUniqueWithoutRecommendationInput[]
    createMany?: RecommendationOutcomeCreateManyRecommendationInputEnvelope
    set?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
    disconnect?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
    delete?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
    connect?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
    update?: RecommendationOutcomeUpdateWithWhereUniqueWithoutRecommendationInput | RecommendationOutcomeUpdateWithWhereUniqueWithoutRecommendationInput[]
    updateMany?: RecommendationOutcomeUpdateManyWithWhereWithoutRecommendationInput | RecommendationOutcomeUpdateManyWithWhereWithoutRecommendationInput[]
    deleteMany?: RecommendationOutcomeScalarWhereInput | RecommendationOutcomeScalarWhereInput[]
  }

  export type RecommendationOutcomeUncheckedUpdateManyWithoutRecommendationNestedInput = {
    create?: XOR<RecommendationOutcomeCreateWithoutRecommendationInput, RecommendationOutcomeUncheckedCreateWithoutRecommendationInput> | RecommendationOutcomeCreateWithoutRecommendationInput[] | RecommendationOutcomeUncheckedCreateWithoutRecommendationInput[]
    connectOrCreate?: RecommendationOutcomeCreateOrConnectWithoutRecommendationInput | RecommendationOutcomeCreateOrConnectWithoutRecommendationInput[]
    upsert?: RecommendationOutcomeUpsertWithWhereUniqueWithoutRecommendationInput | RecommendationOutcomeUpsertWithWhereUniqueWithoutRecommendationInput[]
    createMany?: RecommendationOutcomeCreateManyRecommendationInputEnvelope
    set?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
    disconnect?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
    delete?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
    connect?: RecommendationOutcomeWhereUniqueInput | RecommendationOutcomeWhereUniqueInput[]
    update?: RecommendationOutcomeUpdateWithWhereUniqueWithoutRecommendationInput | RecommendationOutcomeUpdateWithWhereUniqueWithoutRecommendationInput[]
    updateMany?: RecommendationOutcomeUpdateManyWithWhereWithoutRecommendationInput | RecommendationOutcomeUpdateManyWithWhereWithoutRecommendationInput[]
    deleteMany?: RecommendationOutcomeScalarWhereInput | RecommendationOutcomeScalarWhereInput[]
  }

  export type EnumRiskLevelFieldUpdateOperationsInput = {
    set?: $Enums.RiskLevel
  }

  export type CommodityCreateNestedOneWithoutQualitySpecsInput = {
    create?: XOR<CommodityCreateWithoutQualitySpecsInput, CommodityUncheckedCreateWithoutQualitySpecsInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutQualitySpecsInput
    connect?: CommodityWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type CommodityUpdateOneRequiredWithoutQualitySpecsNestedInput = {
    create?: XOR<CommodityCreateWithoutQualitySpecsInput, CommodityUncheckedCreateWithoutQualitySpecsInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutQualitySpecsInput
    upsert?: CommodityUpsertWithoutQualitySpecsInput
    connect?: CommodityWhereUniqueInput
    update?: XOR<XOR<CommodityUpdateToOneWithWhereWithoutQualitySpecsInput, CommodityUpdateWithoutQualitySpecsInput>, CommodityUncheckedUpdateWithoutQualitySpecsInput>
  }

  export type CommodityCreateNestedOneWithoutStorageProfilesInput = {
    create?: XOR<CommodityCreateWithoutStorageProfilesInput, CommodityUncheckedCreateWithoutStorageProfilesInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutStorageProfilesInput
    connect?: CommodityWhereUniqueInput
  }

  export type EnumStorageModeFieldUpdateOperationsInput = {
    set?: $Enums.StorageMode
  }

  export type CommodityUpdateOneRequiredWithoutStorageProfilesNestedInput = {
    create?: XOR<CommodityCreateWithoutStorageProfilesInput, CommodityUncheckedCreateWithoutStorageProfilesInput>
    connectOrCreate?: CommodityCreateOrConnectWithoutStorageProfilesInput
    upsert?: CommodityUpsertWithoutStorageProfilesInput
    connect?: CommodityWhereUniqueInput
    update?: XOR<XOR<CommodityUpdateToOneWithWhereWithoutStorageProfilesInput, CommodityUpdateWithoutStorageProfilesInput>, CommodityUncheckedUpdateWithoutStorageProfilesInput>
  }

  export type RecommendationCreateNestedOneWithoutOutcomesInput = {
    create?: XOR<RecommendationCreateWithoutOutcomesInput, RecommendationUncheckedCreateWithoutOutcomesInput>
    connectOrCreate?: RecommendationCreateOrConnectWithoutOutcomesInput
    connect?: RecommendationWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RecommendationUpdateOneRequiredWithoutOutcomesNestedInput = {
    create?: XOR<RecommendationCreateWithoutOutcomesInput, RecommendationUncheckedCreateWithoutOutcomesInput>
    connectOrCreate?: RecommendationCreateOrConnectWithoutOutcomesInput
    upsert?: RecommendationUpsertWithoutOutcomesInput
    connect?: RecommendationWhereUniqueInput
    update?: XOR<XOR<RecommendationUpdateToOneWithWhereWithoutOutcomesInput, RecommendationUpdateWithoutOutcomesInput>, RecommendationUncheckedUpdateWithoutOutcomesInput>
  }

  export type EnumSeoStatusFieldUpdateOperationsInput = {
    set?: $Enums.SeoStatus
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumMarketTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketType | EnumMarketTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MarketType[] | ListEnumMarketTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketType[] | ListEnumMarketTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketTypeFilter<$PrismaModel> | $Enums.MarketType
  }

  export type NestedEnumMarketTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketType | EnumMarketTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MarketType[] | ListEnumMarketTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketType[] | ListEnumMarketTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketTypeWithAggregatesFilter<$PrismaModel> | $Enums.MarketType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMarketTypeFilter<$PrismaModel>
    _max?: NestedEnumMarketTypeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumRecommendationActionFilter<$PrismaModel = never> = {
    equals?: $Enums.RecommendationAction | EnumRecommendationActionFieldRefInput<$PrismaModel>
    in?: $Enums.RecommendationAction[] | ListEnumRecommendationActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecommendationAction[] | ListEnumRecommendationActionFieldRefInput<$PrismaModel>
    not?: NestedEnumRecommendationActionFilter<$PrismaModel> | $Enums.RecommendationAction
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumRecommendationActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RecommendationAction | EnumRecommendationActionFieldRefInput<$PrismaModel>
    in?: $Enums.RecommendationAction[] | ListEnumRecommendationActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.RecommendationAction[] | ListEnumRecommendationActionFieldRefInput<$PrismaModel>
    not?: NestedEnumRecommendationActionWithAggregatesFilter<$PrismaModel> | $Enums.RecommendationAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRecommendationActionFilter<$PrismaModel>
    _max?: NestedEnumRecommendationActionFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumRiskLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelFilter<$PrismaModel> | $Enums.RiskLevel
  }

  export type NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RiskLevel | EnumRiskLevelFieldRefInput<$PrismaModel>
    in?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.RiskLevel[] | ListEnumRiskLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumRiskLevelWithAggregatesFilter<$PrismaModel> | $Enums.RiskLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRiskLevelFilter<$PrismaModel>
    _max?: NestedEnumRiskLevelFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumStorageModeFilter<$PrismaModel = never> = {
    equals?: $Enums.StorageMode | EnumStorageModeFieldRefInput<$PrismaModel>
    in?: $Enums.StorageMode[] | ListEnumStorageModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StorageMode[] | ListEnumStorageModeFieldRefInput<$PrismaModel>
    not?: NestedEnumStorageModeFilter<$PrismaModel> | $Enums.StorageMode
  }

  export type NestedEnumStorageModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StorageMode | EnumStorageModeFieldRefInput<$PrismaModel>
    in?: $Enums.StorageMode[] | ListEnumStorageModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.StorageMode[] | ListEnumStorageModeFieldRefInput<$PrismaModel>
    not?: NestedEnumStorageModeWithAggregatesFilter<$PrismaModel> | $Enums.StorageMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStorageModeFilter<$PrismaModel>
    _max?: NestedEnumStorageModeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumSeoStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SeoStatus | EnumSeoStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SeoStatus[] | ListEnumSeoStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SeoStatus[] | ListEnumSeoStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSeoStatusFilter<$PrismaModel> | $Enums.SeoStatus
  }

  export type NestedEnumSeoStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SeoStatus | EnumSeoStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SeoStatus[] | ListEnumSeoStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SeoStatus[] | ListEnumSeoStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSeoStatusWithAggregatesFilter<$PrismaModel> | $Enums.SeoStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSeoStatusFilter<$PrismaModel>
    _max?: NestedEnumSeoStatusFilter<$PrismaModel>
  }

  export type MandiPriceCreateWithoutCommodityInput = {
    id?: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
    market: MarketCreateNestedOneWithoutMandiPricesInput
  }

  export type MandiPriceUncheckedCreateWithoutCommodityInput = {
    id?: string
    marketId: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
  }

  export type MandiPriceCreateOrConnectWithoutCommodityInput = {
    where: MandiPriceWhereUniqueInput
    create: XOR<MandiPriceCreateWithoutCommodityInput, MandiPriceUncheckedCreateWithoutCommodityInput>
  }

  export type MandiPriceCreateManyCommodityInputEnvelope = {
    data: MandiPriceCreateManyCommodityInput | MandiPriceCreateManyCommodityInput[]
    skipDuplicates?: boolean
  }

  export type RecommendationCreateWithoutCommodityInput = {
    id?: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal | DecimalJsLike | number | string
    expectedMarginMin?: Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: Decimal | DecimalJsLike | number | string | null
    riskFlags: JsonNullValueInput | InputJsonValue
    assumptions: JsonNullValueInput | InputJsonValue
    payload: JsonNullValueInput | InputJsonValue
    validUntil: Date | string
    createdByAgent: string
    createdAt?: Date | string
    outcomes?: RecommendationOutcomeCreateNestedManyWithoutRecommendationInput
  }

  export type RecommendationUncheckedCreateWithoutCommodityInput = {
    id?: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal | DecimalJsLike | number | string
    expectedMarginMin?: Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: Decimal | DecimalJsLike | number | string | null
    riskFlags: JsonNullValueInput | InputJsonValue
    assumptions: JsonNullValueInput | InputJsonValue
    payload: JsonNullValueInput | InputJsonValue
    validUntil: Date | string
    createdByAgent: string
    createdAt?: Date | string
    outcomes?: RecommendationOutcomeUncheckedCreateNestedManyWithoutRecommendationInput
  }

  export type RecommendationCreateOrConnectWithoutCommodityInput = {
    where: RecommendationWhereUniqueInput
    create: XOR<RecommendationCreateWithoutCommodityInput, RecommendationUncheckedCreateWithoutCommodityInput>
  }

  export type RecommendationCreateManyCommodityInputEnvelope = {
    data: RecommendationCreateManyCommodityInput | RecommendationCreateManyCommodityInput[]
    skipDuplicates?: boolean
  }

  export type QualitySpecCreateWithoutCommodityInput = {
    id?: string
    grade: string
    parameter: string
    minValue?: string | null
    maxValue?: string | null
    checklistNote?: string | null
    createdAt?: Date | string
  }

  export type QualitySpecUncheckedCreateWithoutCommodityInput = {
    id?: string
    grade: string
    parameter: string
    minValue?: string | null
    maxValue?: string | null
    checklistNote?: string | null
    createdAt?: Date | string
  }

  export type QualitySpecCreateOrConnectWithoutCommodityInput = {
    where: QualitySpecWhereUniqueInput
    create: XOR<QualitySpecCreateWithoutCommodityInput, QualitySpecUncheckedCreateWithoutCommodityInput>
  }

  export type QualitySpecCreateManyCommodityInputEnvelope = {
    data: QualitySpecCreateManyCommodityInput | QualitySpecCreateManyCommodityInput[]
    skipDuplicates?: boolean
  }

  export type StorageProfileCreateWithoutCommodityInput = {
    id?: string
    mode: $Enums.StorageMode
    tempRange?: string | null
    humidityRange?: string | null
    maxDays: number
    spoilageRiskNote?: string | null
    createdAt?: Date | string
  }

  export type StorageProfileUncheckedCreateWithoutCommodityInput = {
    id?: string
    mode: $Enums.StorageMode
    tempRange?: string | null
    humidityRange?: string | null
    maxDays: number
    spoilageRiskNote?: string | null
    createdAt?: Date | string
  }

  export type StorageProfileCreateOrConnectWithoutCommodityInput = {
    where: StorageProfileWhereUniqueInput
    create: XOR<StorageProfileCreateWithoutCommodityInput, StorageProfileUncheckedCreateWithoutCommodityInput>
  }

  export type StorageProfileCreateManyCommodityInputEnvelope = {
    data: StorageProfileCreateManyCommodityInput | StorageProfileCreateManyCommodityInput[]
    skipDuplicates?: boolean
  }

  export type MandiPriceUpsertWithWhereUniqueWithoutCommodityInput = {
    where: MandiPriceWhereUniqueInput
    update: XOR<MandiPriceUpdateWithoutCommodityInput, MandiPriceUncheckedUpdateWithoutCommodityInput>
    create: XOR<MandiPriceCreateWithoutCommodityInput, MandiPriceUncheckedCreateWithoutCommodityInput>
  }

  export type MandiPriceUpdateWithWhereUniqueWithoutCommodityInput = {
    where: MandiPriceWhereUniqueInput
    data: XOR<MandiPriceUpdateWithoutCommodityInput, MandiPriceUncheckedUpdateWithoutCommodityInput>
  }

  export type MandiPriceUpdateManyWithWhereWithoutCommodityInput = {
    where: MandiPriceScalarWhereInput
    data: XOR<MandiPriceUpdateManyMutationInput, MandiPriceUncheckedUpdateManyWithoutCommodityInput>
  }

  export type MandiPriceScalarWhereInput = {
    AND?: MandiPriceScalarWhereInput | MandiPriceScalarWhereInput[]
    OR?: MandiPriceScalarWhereInput[]
    NOT?: MandiPriceScalarWhereInput | MandiPriceScalarWhereInput[]
    id?: StringFilter<"MandiPrice"> | string
    commodityId?: StringFilter<"MandiPrice"> | string
    marketId?: StringFilter<"MandiPrice"> | string
    priceMin?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFilter<"MandiPrice"> | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFilter<"MandiPrice"> | Date | string
    source?: StringFilter<"MandiPrice"> | string
    createdAt?: DateTimeFilter<"MandiPrice"> | Date | string
  }

  export type RecommendationUpsertWithWhereUniqueWithoutCommodityInput = {
    where: RecommendationWhereUniqueInput
    update: XOR<RecommendationUpdateWithoutCommodityInput, RecommendationUncheckedUpdateWithoutCommodityInput>
    create: XOR<RecommendationCreateWithoutCommodityInput, RecommendationUncheckedCreateWithoutCommodityInput>
  }

  export type RecommendationUpdateWithWhereUniqueWithoutCommodityInput = {
    where: RecommendationWhereUniqueInput
    data: XOR<RecommendationUpdateWithoutCommodityInput, RecommendationUncheckedUpdateWithoutCommodityInput>
  }

  export type RecommendationUpdateManyWithWhereWithoutCommodityInput = {
    where: RecommendationScalarWhereInput
    data: XOR<RecommendationUpdateManyMutationInput, RecommendationUncheckedUpdateManyWithoutCommodityInput>
  }

  export type RecommendationScalarWhereInput = {
    AND?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
    OR?: RecommendationScalarWhereInput[]
    NOT?: RecommendationScalarWhereInput | RecommendationScalarWhereInput[]
    id?: StringFilter<"Recommendation"> | string
    commodityId?: StringFilter<"Recommendation"> | string
    sourceRegion?: StringFilter<"Recommendation"> | string
    targetMarket?: StringFilter<"Recommendation"> | string
    action?: EnumRecommendationActionFilter<"Recommendation"> | $Enums.RecommendationAction
    confidence?: DecimalFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: DecimalNullableFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: DecimalNullableFilter<"Recommendation"> | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonFilter<"Recommendation">
    assumptions?: JsonFilter<"Recommendation">
    payload?: JsonFilter<"Recommendation">
    validUntil?: DateTimeFilter<"Recommendation"> | Date | string
    createdByAgent?: StringFilter<"Recommendation"> | string
    createdAt?: DateTimeFilter<"Recommendation"> | Date | string
  }

  export type QualitySpecUpsertWithWhereUniqueWithoutCommodityInput = {
    where: QualitySpecWhereUniqueInput
    update: XOR<QualitySpecUpdateWithoutCommodityInput, QualitySpecUncheckedUpdateWithoutCommodityInput>
    create: XOR<QualitySpecCreateWithoutCommodityInput, QualitySpecUncheckedCreateWithoutCommodityInput>
  }

  export type QualitySpecUpdateWithWhereUniqueWithoutCommodityInput = {
    where: QualitySpecWhereUniqueInput
    data: XOR<QualitySpecUpdateWithoutCommodityInput, QualitySpecUncheckedUpdateWithoutCommodityInput>
  }

  export type QualitySpecUpdateManyWithWhereWithoutCommodityInput = {
    where: QualitySpecScalarWhereInput
    data: XOR<QualitySpecUpdateManyMutationInput, QualitySpecUncheckedUpdateManyWithoutCommodityInput>
  }

  export type QualitySpecScalarWhereInput = {
    AND?: QualitySpecScalarWhereInput | QualitySpecScalarWhereInput[]
    OR?: QualitySpecScalarWhereInput[]
    NOT?: QualitySpecScalarWhereInput | QualitySpecScalarWhereInput[]
    id?: StringFilter<"QualitySpec"> | string
    commodityId?: StringFilter<"QualitySpec"> | string
    grade?: StringFilter<"QualitySpec"> | string
    parameter?: StringFilter<"QualitySpec"> | string
    minValue?: StringNullableFilter<"QualitySpec"> | string | null
    maxValue?: StringNullableFilter<"QualitySpec"> | string | null
    checklistNote?: StringNullableFilter<"QualitySpec"> | string | null
    createdAt?: DateTimeFilter<"QualitySpec"> | Date | string
  }

  export type StorageProfileUpsertWithWhereUniqueWithoutCommodityInput = {
    where: StorageProfileWhereUniqueInput
    update: XOR<StorageProfileUpdateWithoutCommodityInput, StorageProfileUncheckedUpdateWithoutCommodityInput>
    create: XOR<StorageProfileCreateWithoutCommodityInput, StorageProfileUncheckedCreateWithoutCommodityInput>
  }

  export type StorageProfileUpdateWithWhereUniqueWithoutCommodityInput = {
    where: StorageProfileWhereUniqueInput
    data: XOR<StorageProfileUpdateWithoutCommodityInput, StorageProfileUncheckedUpdateWithoutCommodityInput>
  }

  export type StorageProfileUpdateManyWithWhereWithoutCommodityInput = {
    where: StorageProfileScalarWhereInput
    data: XOR<StorageProfileUpdateManyMutationInput, StorageProfileUncheckedUpdateManyWithoutCommodityInput>
  }

  export type StorageProfileScalarWhereInput = {
    AND?: StorageProfileScalarWhereInput | StorageProfileScalarWhereInput[]
    OR?: StorageProfileScalarWhereInput[]
    NOT?: StorageProfileScalarWhereInput | StorageProfileScalarWhereInput[]
    id?: StringFilter<"StorageProfile"> | string
    commodityId?: StringFilter<"StorageProfile"> | string
    mode?: EnumStorageModeFilter<"StorageProfile"> | $Enums.StorageMode
    tempRange?: StringNullableFilter<"StorageProfile"> | string | null
    humidityRange?: StringNullableFilter<"StorageProfile"> | string | null
    maxDays?: IntFilter<"StorageProfile"> | number
    spoilageRiskNote?: StringNullableFilter<"StorageProfile"> | string | null
    createdAt?: DateTimeFilter<"StorageProfile"> | Date | string
  }

  export type MandiPriceCreateWithoutMarketInput = {
    id?: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
    commodity: CommodityCreateNestedOneWithoutMandiPricesInput
  }

  export type MandiPriceUncheckedCreateWithoutMarketInput = {
    id?: string
    commodityId: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
  }

  export type MandiPriceCreateOrConnectWithoutMarketInput = {
    where: MandiPriceWhereUniqueInput
    create: XOR<MandiPriceCreateWithoutMarketInput, MandiPriceUncheckedCreateWithoutMarketInput>
  }

  export type MandiPriceCreateManyMarketInputEnvelope = {
    data: MandiPriceCreateManyMarketInput | MandiPriceCreateManyMarketInput[]
    skipDuplicates?: boolean
  }

  export type MandiPriceUpsertWithWhereUniqueWithoutMarketInput = {
    where: MandiPriceWhereUniqueInput
    update: XOR<MandiPriceUpdateWithoutMarketInput, MandiPriceUncheckedUpdateWithoutMarketInput>
    create: XOR<MandiPriceCreateWithoutMarketInput, MandiPriceUncheckedCreateWithoutMarketInput>
  }

  export type MandiPriceUpdateWithWhereUniqueWithoutMarketInput = {
    where: MandiPriceWhereUniqueInput
    data: XOR<MandiPriceUpdateWithoutMarketInput, MandiPriceUncheckedUpdateWithoutMarketInput>
  }

  export type MandiPriceUpdateManyWithWhereWithoutMarketInput = {
    where: MandiPriceScalarWhereInput
    data: XOR<MandiPriceUpdateManyMutationInput, MandiPriceUncheckedUpdateManyWithoutMarketInput>
  }

  export type CommodityCreateWithoutMandiPricesInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    recommendations?: RecommendationCreateNestedManyWithoutCommodityInput
    qualitySpecs?: QualitySpecCreateNestedManyWithoutCommodityInput
    storageProfiles?: StorageProfileCreateNestedManyWithoutCommodityInput
  }

  export type CommodityUncheckedCreateWithoutMandiPricesInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutCommodityInput
    qualitySpecs?: QualitySpecUncheckedCreateNestedManyWithoutCommodityInput
    storageProfiles?: StorageProfileUncheckedCreateNestedManyWithoutCommodityInput
  }

  export type CommodityCreateOrConnectWithoutMandiPricesInput = {
    where: CommodityWhereUniqueInput
    create: XOR<CommodityCreateWithoutMandiPricesInput, CommodityUncheckedCreateWithoutMandiPricesInput>
  }

  export type MarketCreateWithoutMandiPricesInput = {
    id?: string
    name: string
    region: string
    type: $Enums.MarketType
    createdAt?: Date | string
  }

  export type MarketUncheckedCreateWithoutMandiPricesInput = {
    id?: string
    name: string
    region: string
    type: $Enums.MarketType
    createdAt?: Date | string
  }

  export type MarketCreateOrConnectWithoutMandiPricesInput = {
    where: MarketWhereUniqueInput
    create: XOR<MarketCreateWithoutMandiPricesInput, MarketUncheckedCreateWithoutMandiPricesInput>
  }

  export type CommodityUpsertWithoutMandiPricesInput = {
    update: XOR<CommodityUpdateWithoutMandiPricesInput, CommodityUncheckedUpdateWithoutMandiPricesInput>
    create: XOR<CommodityCreateWithoutMandiPricesInput, CommodityUncheckedCreateWithoutMandiPricesInput>
    where?: CommodityWhereInput
  }

  export type CommodityUpdateToOneWithWhereWithoutMandiPricesInput = {
    where?: CommodityWhereInput
    data: XOR<CommodityUpdateWithoutMandiPricesInput, CommodityUncheckedUpdateWithoutMandiPricesInput>
  }

  export type CommodityUpdateWithoutMandiPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recommendations?: RecommendationUpdateManyWithoutCommodityNestedInput
    qualitySpecs?: QualitySpecUpdateManyWithoutCommodityNestedInput
    storageProfiles?: StorageProfileUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityUncheckedUpdateWithoutMandiPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recommendations?: RecommendationUncheckedUpdateManyWithoutCommodityNestedInput
    qualitySpecs?: QualitySpecUncheckedUpdateManyWithoutCommodityNestedInput
    storageProfiles?: StorageProfileUncheckedUpdateManyWithoutCommodityNestedInput
  }

  export type MarketUpsertWithoutMandiPricesInput = {
    update: XOR<MarketUpdateWithoutMandiPricesInput, MarketUncheckedUpdateWithoutMandiPricesInput>
    create: XOR<MarketCreateWithoutMandiPricesInput, MarketUncheckedCreateWithoutMandiPricesInput>
    where?: MarketWhereInput
  }

  export type MarketUpdateToOneWithWhereWithoutMandiPricesInput = {
    where?: MarketWhereInput
    data: XOR<MarketUpdateWithoutMandiPricesInput, MarketUncheckedUpdateWithoutMandiPricesInput>
  }

  export type MarketUpdateWithoutMandiPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    type?: EnumMarketTypeFieldUpdateOperationsInput | $Enums.MarketType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketUncheckedUpdateWithoutMandiPricesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    type?: EnumMarketTypeFieldUpdateOperationsInput | $Enums.MarketType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommodityCreateWithoutRecommendationsInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    mandiPrices?: MandiPriceCreateNestedManyWithoutCommodityInput
    qualitySpecs?: QualitySpecCreateNestedManyWithoutCommodityInput
    storageProfiles?: StorageProfileCreateNestedManyWithoutCommodityInput
  }

  export type CommodityUncheckedCreateWithoutRecommendationsInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    mandiPrices?: MandiPriceUncheckedCreateNestedManyWithoutCommodityInput
    qualitySpecs?: QualitySpecUncheckedCreateNestedManyWithoutCommodityInput
    storageProfiles?: StorageProfileUncheckedCreateNestedManyWithoutCommodityInput
  }

  export type CommodityCreateOrConnectWithoutRecommendationsInput = {
    where: CommodityWhereUniqueInput
    create: XOR<CommodityCreateWithoutRecommendationsInput, CommodityUncheckedCreateWithoutRecommendationsInput>
  }

  export type RecommendationOutcomeCreateWithoutRecommendationInput = {
    id?: string
    executed?: boolean
    executedQtyTons?: Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: Decimal | DecimalJsLike | number | string | null
    realizedMargin?: Decimal | DecimalJsLike | number | string | null
    spoilagePct?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    recordedAt?: Date | string
  }

  export type RecommendationOutcomeUncheckedCreateWithoutRecommendationInput = {
    id?: string
    executed?: boolean
    executedQtyTons?: Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: Decimal | DecimalJsLike | number | string | null
    realizedMargin?: Decimal | DecimalJsLike | number | string | null
    spoilagePct?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    recordedAt?: Date | string
  }

  export type RecommendationOutcomeCreateOrConnectWithoutRecommendationInput = {
    where: RecommendationOutcomeWhereUniqueInput
    create: XOR<RecommendationOutcomeCreateWithoutRecommendationInput, RecommendationOutcomeUncheckedCreateWithoutRecommendationInput>
  }

  export type RecommendationOutcomeCreateManyRecommendationInputEnvelope = {
    data: RecommendationOutcomeCreateManyRecommendationInput | RecommendationOutcomeCreateManyRecommendationInput[]
    skipDuplicates?: boolean
  }

  export type CommodityUpsertWithoutRecommendationsInput = {
    update: XOR<CommodityUpdateWithoutRecommendationsInput, CommodityUncheckedUpdateWithoutRecommendationsInput>
    create: XOR<CommodityCreateWithoutRecommendationsInput, CommodityUncheckedCreateWithoutRecommendationsInput>
    where?: CommodityWhereInput
  }

  export type CommodityUpdateToOneWithWhereWithoutRecommendationsInput = {
    where?: CommodityWhereInput
    data: XOR<CommodityUpdateWithoutRecommendationsInput, CommodityUncheckedUpdateWithoutRecommendationsInput>
  }

  export type CommodityUpdateWithoutRecommendationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUpdateManyWithoutCommodityNestedInput
    qualitySpecs?: QualitySpecUpdateManyWithoutCommodityNestedInput
    storageProfiles?: StorageProfileUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityUncheckedUpdateWithoutRecommendationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUncheckedUpdateManyWithoutCommodityNestedInput
    qualitySpecs?: QualitySpecUncheckedUpdateManyWithoutCommodityNestedInput
    storageProfiles?: StorageProfileUncheckedUpdateManyWithoutCommodityNestedInput
  }

  export type RecommendationOutcomeUpsertWithWhereUniqueWithoutRecommendationInput = {
    where: RecommendationOutcomeWhereUniqueInput
    update: XOR<RecommendationOutcomeUpdateWithoutRecommendationInput, RecommendationOutcomeUncheckedUpdateWithoutRecommendationInput>
    create: XOR<RecommendationOutcomeCreateWithoutRecommendationInput, RecommendationOutcomeUncheckedCreateWithoutRecommendationInput>
  }

  export type RecommendationOutcomeUpdateWithWhereUniqueWithoutRecommendationInput = {
    where: RecommendationOutcomeWhereUniqueInput
    data: XOR<RecommendationOutcomeUpdateWithoutRecommendationInput, RecommendationOutcomeUncheckedUpdateWithoutRecommendationInput>
  }

  export type RecommendationOutcomeUpdateManyWithWhereWithoutRecommendationInput = {
    where: RecommendationOutcomeScalarWhereInput
    data: XOR<RecommendationOutcomeUpdateManyMutationInput, RecommendationOutcomeUncheckedUpdateManyWithoutRecommendationInput>
  }

  export type RecommendationOutcomeScalarWhereInput = {
    AND?: RecommendationOutcomeScalarWhereInput | RecommendationOutcomeScalarWhereInput[]
    OR?: RecommendationOutcomeScalarWhereInput[]
    NOT?: RecommendationOutcomeScalarWhereInput | RecommendationOutcomeScalarWhereInput[]
    id?: StringFilter<"RecommendationOutcome"> | string
    recommendationId?: StringFilter<"RecommendationOutcome"> | string
    executed?: BoolFilter<"RecommendationOutcome"> | boolean
    executedQtyTons?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: DecimalNullableFilter<"RecommendationOutcome"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"RecommendationOutcome"> | string | null
    recordedAt?: DateTimeFilter<"RecommendationOutcome"> | Date | string
  }

  export type CommodityCreateWithoutQualitySpecsInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    mandiPrices?: MandiPriceCreateNestedManyWithoutCommodityInput
    recommendations?: RecommendationCreateNestedManyWithoutCommodityInput
    storageProfiles?: StorageProfileCreateNestedManyWithoutCommodityInput
  }

  export type CommodityUncheckedCreateWithoutQualitySpecsInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    mandiPrices?: MandiPriceUncheckedCreateNestedManyWithoutCommodityInput
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutCommodityInput
    storageProfiles?: StorageProfileUncheckedCreateNestedManyWithoutCommodityInput
  }

  export type CommodityCreateOrConnectWithoutQualitySpecsInput = {
    where: CommodityWhereUniqueInput
    create: XOR<CommodityCreateWithoutQualitySpecsInput, CommodityUncheckedCreateWithoutQualitySpecsInput>
  }

  export type CommodityUpsertWithoutQualitySpecsInput = {
    update: XOR<CommodityUpdateWithoutQualitySpecsInput, CommodityUncheckedUpdateWithoutQualitySpecsInput>
    create: XOR<CommodityCreateWithoutQualitySpecsInput, CommodityUncheckedCreateWithoutQualitySpecsInput>
    where?: CommodityWhereInput
  }

  export type CommodityUpdateToOneWithWhereWithoutQualitySpecsInput = {
    where?: CommodityWhereInput
    data: XOR<CommodityUpdateWithoutQualitySpecsInput, CommodityUncheckedUpdateWithoutQualitySpecsInput>
  }

  export type CommodityUpdateWithoutQualitySpecsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUpdateManyWithoutCommodityNestedInput
    recommendations?: RecommendationUpdateManyWithoutCommodityNestedInput
    storageProfiles?: StorageProfileUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityUncheckedUpdateWithoutQualitySpecsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUncheckedUpdateManyWithoutCommodityNestedInput
    recommendations?: RecommendationUncheckedUpdateManyWithoutCommodityNestedInput
    storageProfiles?: StorageProfileUncheckedUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityCreateWithoutStorageProfilesInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    mandiPrices?: MandiPriceCreateNestedManyWithoutCommodityInput
    recommendations?: RecommendationCreateNestedManyWithoutCommodityInput
    qualitySpecs?: QualitySpecCreateNestedManyWithoutCommodityInput
  }

  export type CommodityUncheckedCreateWithoutStorageProfilesInput = {
    id?: string
    code: string
    name: string
    category: string
    defaultShelfLifeDays: number
    createdAt?: Date | string
    mandiPrices?: MandiPriceUncheckedCreateNestedManyWithoutCommodityInput
    recommendations?: RecommendationUncheckedCreateNestedManyWithoutCommodityInput
    qualitySpecs?: QualitySpecUncheckedCreateNestedManyWithoutCommodityInput
  }

  export type CommodityCreateOrConnectWithoutStorageProfilesInput = {
    where: CommodityWhereUniqueInput
    create: XOR<CommodityCreateWithoutStorageProfilesInput, CommodityUncheckedCreateWithoutStorageProfilesInput>
  }

  export type CommodityUpsertWithoutStorageProfilesInput = {
    update: XOR<CommodityUpdateWithoutStorageProfilesInput, CommodityUncheckedUpdateWithoutStorageProfilesInput>
    create: XOR<CommodityCreateWithoutStorageProfilesInput, CommodityUncheckedCreateWithoutStorageProfilesInput>
    where?: CommodityWhereInput
  }

  export type CommodityUpdateToOneWithWhereWithoutStorageProfilesInput = {
    where?: CommodityWhereInput
    data: XOR<CommodityUpdateWithoutStorageProfilesInput, CommodityUncheckedUpdateWithoutStorageProfilesInput>
  }

  export type CommodityUpdateWithoutStorageProfilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUpdateManyWithoutCommodityNestedInput
    recommendations?: RecommendationUpdateManyWithoutCommodityNestedInput
    qualitySpecs?: QualitySpecUpdateManyWithoutCommodityNestedInput
  }

  export type CommodityUncheckedUpdateWithoutStorageProfilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    defaultShelfLifeDays?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mandiPrices?: MandiPriceUncheckedUpdateManyWithoutCommodityNestedInput
    recommendations?: RecommendationUncheckedUpdateManyWithoutCommodityNestedInput
    qualitySpecs?: QualitySpecUncheckedUpdateManyWithoutCommodityNestedInput
  }

  export type RecommendationCreateWithoutOutcomesInput = {
    id?: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal | DecimalJsLike | number | string
    expectedMarginMin?: Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: Decimal | DecimalJsLike | number | string | null
    riskFlags: JsonNullValueInput | InputJsonValue
    assumptions: JsonNullValueInput | InputJsonValue
    payload: JsonNullValueInput | InputJsonValue
    validUntil: Date | string
    createdByAgent: string
    createdAt?: Date | string
    commodity: CommodityCreateNestedOneWithoutRecommendationsInput
  }

  export type RecommendationUncheckedCreateWithoutOutcomesInput = {
    id?: string
    commodityId: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal | DecimalJsLike | number | string
    expectedMarginMin?: Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: Decimal | DecimalJsLike | number | string | null
    riskFlags: JsonNullValueInput | InputJsonValue
    assumptions: JsonNullValueInput | InputJsonValue
    payload: JsonNullValueInput | InputJsonValue
    validUntil: Date | string
    createdByAgent: string
    createdAt?: Date | string
  }

  export type RecommendationCreateOrConnectWithoutOutcomesInput = {
    where: RecommendationWhereUniqueInput
    create: XOR<RecommendationCreateWithoutOutcomesInput, RecommendationUncheckedCreateWithoutOutcomesInput>
  }

  export type RecommendationUpsertWithoutOutcomesInput = {
    update: XOR<RecommendationUpdateWithoutOutcomesInput, RecommendationUncheckedUpdateWithoutOutcomesInput>
    create: XOR<RecommendationCreateWithoutOutcomesInput, RecommendationUncheckedCreateWithoutOutcomesInput>
    where?: RecommendationWhereInput
  }

  export type RecommendationUpdateToOneWithWhereWithoutOutcomesInput = {
    where?: RecommendationWhereInput
    data: XOR<RecommendationUpdateWithoutOutcomesInput, RecommendationUncheckedUpdateWithoutOutcomesInput>
  }

  export type RecommendationUpdateWithoutOutcomesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: CommodityUpdateOneRequiredWithoutRecommendationsNestedInput
  }

  export type RecommendationUncheckedUpdateWithoutOutcomesInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MandiPriceCreateManyCommodityInput = {
    id?: string
    marketId: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
  }

  export type RecommendationCreateManyCommodityInput = {
    id?: string
    sourceRegion: string
    targetMarket: string
    action: $Enums.RecommendationAction
    confidence: Decimal | DecimalJsLike | number | string
    expectedMarginMin?: Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: Decimal | DecimalJsLike | number | string | null
    riskFlags: JsonNullValueInput | InputJsonValue
    assumptions: JsonNullValueInput | InputJsonValue
    payload: JsonNullValueInput | InputJsonValue
    validUntil: Date | string
    createdByAgent: string
    createdAt?: Date | string
  }

  export type QualitySpecCreateManyCommodityInput = {
    id?: string
    grade: string
    parameter: string
    minValue?: string | null
    maxValue?: string | null
    checklistNote?: string | null
    createdAt?: Date | string
  }

  export type StorageProfileCreateManyCommodityInput = {
    id?: string
    mode: $Enums.StorageMode
    tempRange?: string | null
    humidityRange?: string | null
    maxDays: number
    spoilageRiskNote?: string | null
    createdAt?: Date | string
  }

  export type MandiPriceUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    market?: MarketUpdateOneRequiredWithoutMandiPricesNestedInput
  }

  export type MandiPriceUncheckedUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    marketId?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MandiPriceUncheckedUpdateManyWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    marketId?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outcomes?: RecommendationOutcomeUpdateManyWithoutRecommendationNestedInput
  }

  export type RecommendationUncheckedUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outcomes?: RecommendationOutcomeUncheckedUpdateManyWithoutRecommendationNestedInput
  }

  export type RecommendationUncheckedUpdateManyWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceRegion?: StringFieldUpdateOperationsInput | string
    targetMarket?: StringFieldUpdateOperationsInput | string
    action?: EnumRecommendationActionFieldUpdateOperationsInput | $Enums.RecommendationAction
    confidence?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expectedMarginMin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    expectedMarginMax?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    riskFlags?: JsonNullValueInput | InputJsonValue
    assumptions?: JsonNullValueInput | InputJsonValue
    payload?: JsonNullValueInput | InputJsonValue
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAgent?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QualitySpecUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    parameter?: StringFieldUpdateOperationsInput | string
    minValue?: NullableStringFieldUpdateOperationsInput | string | null
    maxValue?: NullableStringFieldUpdateOperationsInput | string | null
    checklistNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QualitySpecUncheckedUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    parameter?: StringFieldUpdateOperationsInput | string
    minValue?: NullableStringFieldUpdateOperationsInput | string | null
    maxValue?: NullableStringFieldUpdateOperationsInput | string | null
    checklistNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QualitySpecUncheckedUpdateManyWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    parameter?: StringFieldUpdateOperationsInput | string
    minValue?: NullableStringFieldUpdateOperationsInput | string | null
    maxValue?: NullableStringFieldUpdateOperationsInput | string | null
    checklistNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageProfileUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumStorageModeFieldUpdateOperationsInput | $Enums.StorageMode
    tempRange?: NullableStringFieldUpdateOperationsInput | string | null
    humidityRange?: NullableStringFieldUpdateOperationsInput | string | null
    maxDays?: IntFieldUpdateOperationsInput | number
    spoilageRiskNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageProfileUncheckedUpdateWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumStorageModeFieldUpdateOperationsInput | $Enums.StorageMode
    tempRange?: NullableStringFieldUpdateOperationsInput | string | null
    humidityRange?: NullableStringFieldUpdateOperationsInput | string | null
    maxDays?: IntFieldUpdateOperationsInput | number
    spoilageRiskNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageProfileUncheckedUpdateManyWithoutCommodityInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumStorageModeFieldUpdateOperationsInput | $Enums.StorageMode
    tempRange?: NullableStringFieldUpdateOperationsInput | string | null
    humidityRange?: NullableStringFieldUpdateOperationsInput | string | null
    maxDays?: IntFieldUpdateOperationsInput | number
    spoilageRiskNote?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MandiPriceCreateManyMarketInput = {
    id?: string
    commodityId: string
    priceMin: Decimal | DecimalJsLike | number | string
    priceMax: Decimal | DecimalJsLike | number | string
    priceModal: Decimal | DecimalJsLike | number | string
    observedAt: Date | string
    source: string
    createdAt?: Date | string
  }

  export type MandiPriceUpdateWithoutMarketInput = {
    id?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commodity?: CommodityUpdateOneRequiredWithoutMandiPricesNestedInput
  }

  export type MandiPriceUncheckedUpdateWithoutMarketInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MandiPriceUncheckedUpdateManyWithoutMarketInput = {
    id?: StringFieldUpdateOperationsInput | string
    commodityId?: StringFieldUpdateOperationsInput | string
    priceMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceModal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationOutcomeCreateManyRecommendationInput = {
    id?: string
    executed?: boolean
    executedQtyTons?: Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: Decimal | DecimalJsLike | number | string | null
    realizedMargin?: Decimal | DecimalJsLike | number | string | null
    spoilagePct?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    recordedAt?: Date | string
  }

  export type RecommendationOutcomeUpdateWithoutRecommendationInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed?: BoolFieldUpdateOperationsInput | boolean
    executedQtyTons?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationOutcomeUncheckedUpdateWithoutRecommendationInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed?: BoolFieldUpdateOperationsInput | boolean
    executedQtyTons?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecommendationOutcomeUncheckedUpdateManyWithoutRecommendationInput = {
    id?: StringFieldUpdateOperationsInput | string
    executed?: BoolFieldUpdateOperationsInput | boolean
    executedQtyTons?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedBuyAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedSellAvg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedMargin?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    spoilagePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CommodityCountOutputTypeDefaultArgs instead
     */
    export type CommodityCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommodityCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MarketCountOutputTypeDefaultArgs instead
     */
    export type MarketCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MarketCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RecommendationCountOutputTypeDefaultArgs instead
     */
    export type RecommendationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RecommendationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommodityDefaultArgs instead
     */
    export type CommodityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommodityDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MarketDefaultArgs instead
     */
    export type MarketArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MarketDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MandiPriceDefaultArgs instead
     */
    export type MandiPriceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MandiPriceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RecommendationDefaultArgs instead
     */
    export type RecommendationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RecommendationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WeatherSnapshotDefaultArgs instead
     */
    export type WeatherSnapshotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WeatherSnapshotDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QualitySpecDefaultArgs instead
     */
    export type QualitySpecArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QualitySpecDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StorageProfileDefaultArgs instead
     */
    export type StorageProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StorageProfileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RecommendationOutcomeDefaultArgs instead
     */
    export type RecommendationOutcomeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RecommendationOutcomeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SeoContentJobDefaultArgs instead
     */
    export type SeoContentJobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SeoContentJobDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}