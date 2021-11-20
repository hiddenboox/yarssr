import WebpackDevServer from 'webpack-dev-server';

export class WebpackDevServerPlugin {
  async apply(compiler) {
    const devServer = new WebpackDevServer(compiler.options.devServer, compiler);

    await devServer.start('localhost');

    process.once('exit', async () => {
        await devServer.stop();
    });
    process.once('SIGINT', () => {
      process.exit(0);
    });
  }
};