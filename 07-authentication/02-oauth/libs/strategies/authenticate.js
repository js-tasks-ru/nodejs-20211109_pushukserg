const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  const user = await User.findOne({email});

  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  if (user) {
    done(null, user, `функция аутентификации с помощью ${strategy} не настроена`);
  } else {
    await User.create({email, displayName}).then((data) => {
      done(null, data, `функция аутентификации с помощью ${strategy} не настроена`);
    }).catch((err) => {
      err;
      done(err, false);
    });
  }
};
