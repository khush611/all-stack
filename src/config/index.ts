// app config - all the magic numbers and settings go here

export const config = {
    api: {
      baseUrl: import.meta.env.VITE_API_URL || 'https://pokeapi.co/api/v2',
      timeout: 10000,
      retryAttempts: 3,
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 20, 50] as const,
    },
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5 mins
    },
    moves: {
      maxFetchCount: 20, /*
      Don't fetch too many moves or we'll spam the api. 
      Basically, limiting moves fetched per Pokemon to avoid API overload.
      */
    },
  } as const
  
  export type Config = typeof config