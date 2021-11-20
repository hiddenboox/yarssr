import { html } from 'common-tags';

export const getHeader = () => {
    return html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta property="og:site_name" content="Frontendowe Świry">
        </head>
        <body data-theme="light">
          <div id="root">`;
  };

  const createScriptTag = ({ src }) => `<script defer type="text/javascript" src="${src}"></script>`

  export const getFooter = ({
    assets,
  }) => {
    return html`</div>
        ${assets.map(src => createScriptTag({ src }))}
      </body>
      </html>
    `;
  };