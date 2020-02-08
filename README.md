# Kostnadr

Offline first (lol sorta) expenses tracking with a dash of data visualization.

## Resources

- [Trello](https://trello.com/b/5JwgZiBQ/kostnadr)
- [Ant Design](https://ant.design/)
- [G2Plot](https://g2plot.antv.vision/en)
- [Firebase](https://firebase.google.com/)

## How2Do.exe

- `git clone git@github.com:duhduhdan/expense-tracker.git`
- `cd expense-tracker`
- `yarn install`
- `yarn start`

## Known problems

- If data is messed up, delete `LokiCatalog` and in `ExpensesScreen.tsx` uncomment `create()` to fetch remotely stored data after a refresh to put into local database.
- Doing the above causes some weird id collision issues in local DB, but it's not a real error, so just comment out `create()` again and refresh page.
