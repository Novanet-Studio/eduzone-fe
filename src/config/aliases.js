const aliases = (prefix = 'src') => ({
  '@': `${prefix}`,
  '@components': `${prefix}/components`,
  '@constants': `${prefix}/constants`,
  '@layout': `${prefix}/layout`,
  '@hooks': `${prefix}/hooks`,
  '@services': `${prefix}/services`,
  '@utils': `${prefix}/utils`,
  '@views': `${prefix}/views`,
  '@images': `${prefix}/assets/images`,
})

module.exports = aliases
