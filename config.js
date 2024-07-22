

const toBool = (x) => x === 'true';

module.exports = {
    SESSION_ID: process.env.SESSION_ID || '',
    HANDLERS: process.env.HANDLERS || '#',//[.]
    BOT_NAME: process.env.BOT_NAME || 'DevilSer_Md',
    OWNER_NAME: process.env.OWNER_NAME || '🙃',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '919539060020',
    SUDO: process.env.SUDO || '919539060020',
    MODE: (process.env.MODE || 'public').trim(),
    STICKER_DATA: process.env.STICKER_DATA || '🎯inrl-𝙼𝙳;loki-x☘️',
};
