module.exports = {
  default: {
    requireModule: [require.resolve('./src/support/load-env.js')],
    require: ['src/support/**/*.js', 'src/step-definitions/**/*.js'],
    paths: ['features/**/*.feature'],
    format: ['progress', 'html:reports/cucumber-report.html'],
    publishQuiet: true
  }
};
