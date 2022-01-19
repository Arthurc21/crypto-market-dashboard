# Crypto Comparator Dashboard

## Summary

This implementation seeks to concentrate in one place the display of current and historical values of cryptocurrencies from different exchangers.

### Objectives
- Create an interface that will be divided into 2 parts, login and dashboard
- Validate format of user data when loign
- Show the current values of cryptocurrencies BTC, ETH AND XRP registered by 3 different exchangers
- Update data every 15 seconds
- Calculate and display the value of an exchange from MXN to the selected cryptocurrency based on the prices of the exchangers

## To-Do

1. Define project structure
2. Define stack and tools to use
3. Structure state
4. Structure consumption of websockets and endpoints
5. Define types
6. Create UI Mockup
7. Develop components
8. Assign routes
9. Connect components with state
10. Write test

## Test
- Snapshot creation
- Components rendering
- Components feature testing
- Unit tests for utilities functions


# Installing and running locally

## To install the project dependencies
``` shell script
npm install
```

## To run locally with node
Run the app in the development mode.
``` shell script
npm start
```

## Building for production
Build the app for production to the build folder.
``` shell script
npm run build
```

## Testing project
Launches the test runner in the interactive watch mode.
``` shell script
npm test
```

For updating snapshots
``` shell script
npm run test:update
```

# Final Notes

I was not able to find sources that tracked data on Coinrex and Bitlem, so I opted to select 2 other exchanges within the top 10 of "Top Cryptocurrency Exchanges Ranking by Trust Score" by coingecko.com

https://www.coingecko.com/en/exchanges