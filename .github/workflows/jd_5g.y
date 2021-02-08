# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: jd_5g

on:
  workflow_dispatch:
  schedule:
    - cron: '46 15,21,3,9 * * *'
  repository_dispatch:
    types: jd_sgmh
jobs:
  build:

    runs-on: ubuntu-latest
    if: github.event.repository.owner.id == github.event.sender.id
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          repository: hajiuhajiu/jdsign1112
          ref: master
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: Cache node_modules
        uses: actions/cache@v2 # 使用 GitHub 官方的缓存 Action。
        env:
          cache-name: cache-node-modules
        with:
          path: node_modules
          key: ${{ runner.os }}-${{ env.cache-name }}-${{ hashFiles('package-lock.json') }} # 使用 package-lock.json 的 Hash 作为缓存的 key。也可以使用 package.json 代替
      - name: npm install
        run: |
          npm install
      - name: Set up Python 3.7
        uses: actions/setup-python@v2
        with:
          python-version: 3.7
      - name: 阻塞运行
        run: |          
          python3 wait24.py 
      - name: '运行5g'
        run: |
          node jd_5g.js
        env:
          JD_COOKIE: ${{ secrets.JD_COOKIE }}
          JD_USER_AGENT: ${{ secrets.JD_USER_AGENT }}
          JD_DEBUG: ${{ secrets.JD_DEBUG }}
          PUSH_KEY: ${{ secrets.PUSH_KEY }}
          QQ_SKEY: ${{ secrets.QQ_SKEY }}
          QQ_MODE: ${{ secrets.QQ_MODE }}
          BARK_PUSH: ${{ secrets.BARK_PUSH }}
          TG_BOT_TOKEN: ${{ secrets.TG_BOT_TOKEN }}
          TG_USER_ID: ${{ secrets.TG_USER_ID }}
          BARK_SOUND: ${{ secrets.BARK_SOUND }}
          DD_BOT_TOKEN: ${{ secrets.DD_BOT_TOKEN }}
          DD_BOT_SECRET: ${{ secrets.DD_BOT_SECRET }}
          IGOT_PUSH_KEY: ${{ secrets.IGOT_PUSH_KEY }}

