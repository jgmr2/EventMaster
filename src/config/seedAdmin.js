const User = require('../models/users');

const ensureAdminUser = async () => {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const forcePassword = process.env.ADMIN_FORCE_PASSWORD === 'true';

    if (!name || !email || !password) {
        console.warn('Seed admin omitido: faltan ADMIN_NAME, ADMIN_EMAIL o ADMIN_PASSWORD');
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    let admin = await User.findOne({ email: normalizedEmail });

    if (!admin) {
        admin = new User({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: 'admin'
        });

        await admin.save();
        console.log(`Admin creado automáticamente: ${normalizedEmail}`);
        return;
    }

    let changed = false;

    if (admin.role !== 'admin') {
        admin.role = 'admin';
        changed = true;
    }

    if (admin.name !== name.trim()) {
        admin.name = name.trim();
        changed = true;
    }

    if (forcePassword) {
        admin.password = password;
        changed = true;
    }

    if (changed) {
        await admin.save();
        console.log(`Admin actualizado automáticamente: ${normalizedEmail}`);
    } else {
        console.log(`Admin verificado: ${normalizedEmail}`);
    }
};

module.exports = ensureAdminUser;