<img src="https://github.com/ragrag/cache-puppy/blob/main/meta/puppy.png" alt="alt text" width="450" height="450">

[![PR's Welcome][pr-welcoming-image]][pr-welcoming-url]

## Lightweight application memory cache-revalidate with minimal retry/fallback strategy

&nbsp;

## Npm installation

```
$ npm install cache-puppy
```

## Basic Usage

```ts
import { CachePuppy } from 'cache-puppy';
import axios from 'axios';

const fetchPets = async (): Promise<IPet[]> => {
  return (await axios.get('www.pets/api/puppies')).data;
};

// cached pets with revalidation every 5 minutes
const cache = new CachePuppy<IPet[]>({
  initialData: fetchPets,
  revalidateFn: fetchPets,
  fallbackFn: [
    { petId: 23, name: 'bulldog' },
    { petId: 18, name: 'yorkshire terrier' },
  ],
  revalidateOpts: {
    retries: 5,
    interval: 1000 * 60 * 5, // 5 mins
  },
});

// some time later
console.log(cache.get()); // cached pets
```

## Basic Features

- Simple to the point interface
- Linear and exponential retry strategies
- Provides custom Initial data, Revalidate and Fallback resolvers
- Allows plugging in custom cache setters/getters (can be useful for using other in memory caching connectors e.g Redis, Memcached)

## API

### **CachePuppy<T>(options: CacheOpts)**

### **CacheOpts**

An object type representing cache options

#### properties

| Property        |                  Type                  | description                                          | default                            |
| --------------- | :------------------------------------: | ---------------------------------------------------- | ---------------------------------- |
| initialData?    | (() => T \| Promise< T >) &#124; T | initial cache data or a function to be resolved from | undefined                          |
| revalidateFn?   | (() => T &#124; Promise< T >) &#124; T | revalidation data or a function to be resolved from  | undefined                          |
| fallBackFn?     | (() => T &#124; Promise< T >) &#124; T | fallback value or a function to be resolved from     | undefined                          |
| getterFn?       |       () => T &#124; undefined       | custom cache getter function                         | undefined                          |
| setterFn?       |            (data) => void            | custom cache setter function                         | undefined                          |
| revalidateOpts? |  [RevalidateOpts<T>](#RevalidateOpts)  | revalidation options                                 | defaultCacheOptions.revalidateOpts |

### **RevalidateOpts**

An object cache revalidation options

#### properties

| Property            |                    Type                     | description                                                    | default      |
| ------------------- | :-----------------------------------------: | -------------------------------------------------------------- | ------------ |
| strategy?           |        linear &#124; exponential        | cache retry strategy                                           | linear     |
| interval?           |                  number                  | cache revalidation interval (ms)                               | 6000 (1 min) |
| backOff?            |                  number                   | retry backoff time (ms)                                        | 300          |
| exponentialBackoff? |                  number                   | retry exponential backoff time (ms) (for exponential strategy) | 10           |
| retries             |                  number                   | number of maximum retries                                      | 3            |
| onSuccess           |   (cache) => Promise< void > &#124; void   | callback on revalidation success                               | undefined    |
| onRetriesReached    | (cache, err) => Promise< void > &#124; void | callback on maximum retries reached                            | undefined    |

### **Todo**

- async getterFn/setterFn
- tests

[pr-welcoming-image]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[pr-welcoming-url]: https://github.com/koajs/koa/pull/new
