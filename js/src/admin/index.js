import app from 'flarum/app';

app.initializers.add('dalez-twemoji', () => {
    app.extensionData.for('dalez-twemoji')
    .registerSetting(
        {
            setting: 'flarum-twemoji.base',
            label: app.translator.trans('flarum-twemoji.admin.settings.base'),
            type: 'text',
            help: app.translator.trans('flarum-twemoji.admin.settings.basehelp')[0].replace('$', "'${Version}'"),
            placeholder: app.translator.trans('flarum-twemoji.admin.settings.baseph')
        }
    )
    .registerSetting(
        {
            setting: 'flarum-twemoji.folder',
            label: app.translator.trans('flarum-twemoji.admin.settings.folder'),
            type: 'text',
            placeholder: app.translator.trans('flarum-twemoji.admin.settings.folderph')
        }
    )
    .registerSetting(
        {
            setting: 'flarum-twemoji.ext',
            label: app.translator.trans('flarum-twemoji.admin.settings.ext'),
            type: 'text',
            placeholder: app.translator.trans('flarum-twemoji.admin.settings.extph')
        }
    )
    .registerSetting(
        {
            setting: 'flarum-twemoji.disable_autocomplete',
            label: app.translator.trans('flarum-twemoji.admin.settings.disable_autocomplete'),
            type: 'switch'
        }
    )
    .registerSetting(
        {
            setting: 'flarum-twemoji.use_emoji_as_filename',
            label: app.translator.trans('flarum-twemoji.admin.settings.use_emoji_as_filename') || 'Use emoji character as filename',
            help: app.translator.trans('flarum-twemoji.admin.settings.use_emoji_as_filename_help') || 'Enable this if your emoji files are named with the actual emoji character (e.g. "😀.gif")',
            type: 'switch'
        }
    )
})