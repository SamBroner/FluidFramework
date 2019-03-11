export function craftHtml(
    docId: string,
    routerlicious: string,
    historian: string,
    tenantId: string,
    token: string,
    packageUrl: string,
    loaderType: string) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${docId}</title>
    </head>
    <script>
    loader.startLoading(
        "${docId}",
        "${routerlicious}",
        "${historian}",
        "${tenantId}",
        "${token}",
        "${packageUrl}",
        "${loaderType}");
    .catch((error) => console.error(error));
    </script>
    <body>
        <div style="width: 100vw; height: 100vh;">
            <div id="content"></div>
        </div>
    </body>
    </html>`;
    return html;
}
