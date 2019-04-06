import { h } from "hyperapp"

const favicon = (
  <img
    class="app-header-logo g-self-icon"
    src="/favicon.jpg"
    width={24} height={24} alt="vain0x avatar" />
)

export default (contents: JSX.Element) => (
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>vain0x's Page</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" type="text/css" media="screen" href="/theme.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="/index.css" />
      <link rel="icon" type="image/png" href="/favicon.jpg" />
    </head>
    <body id="app">
      <header class="app-header-container g-nav">
        <input type="checkbox" id="app-header-nav-button-checkbox" />

        <div class="app-header-contents">
          <div class="app-header-header">
            <a href="/" class="app-header-link">
              <h1 class="app-header-heading">
                {favicon}'s Page
              </h1>
            </a>
          </div>

          <div class="app-header-main">
            <a class="app-header-link" href="https://vain0x.github.io/blog/">
              ブログ
            </a>
            <a class="app-header-link" href="https://qiita.com/tags/%E7%AB%B6%E3%83%97%E3%83%AD%E5%8F%82%E6%88%A6%E8%A8%98">
              競プロ参戦記
            </a>
            <a class="app-header-link" href="https://github.com/vain0x">
              GitHub
            </a>
          </div>

          <div class="app-header-footer">
            <label for="app-header-nav-button-checkbox" class="app-header-nav-button-container">
              <span class="app-header-nav-button-heading">
                ≡
              </span>
            </label>
          </div>
        </div>
      </header>

      <main class="app-main-container">
        {contents}
      </main>
    </body>
  </html>
)
