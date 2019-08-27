const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('./models/userModel');
const Poll = require('./models/pollModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB successfull connection!');
  })
  .catch(err => {
    console.log(err);
  });

const users = [
  { username: 'username', password: 'password' },
  { username: 'kelvin', password: 'password' }
];

const polls = [
  {
    question: 'Which is the best JavaScript framework',
    options: ['Angular', 'React', 'VueJS']
  },
  { question: 'Who is the best mutant', options: ['Wolverine', 'Deadpool'] },
  { question: 'Truth or dare', options: ['Truth', 'Dare'] },
  { question: 'Boolean?', options: ['True', 'False'] }
];

const seed = async () => {
  try {
    await User.remove();
    console.log('DROP ALL USERS');

    await Poll.remove();
    console.log('DROP ALL POLLS');

    await Promise.all(
      users.map(async user => {
        const data = await User.create(user);
        await data.save();
      })
    );
    console.log('CREATED USERS', JSON.stringify(users));

    await Promise.all(
      polls.map(async poll => {
        poll.options = poll.options.map(option => ({ option, votes: 0 }));
        const data = await Poll.create(poll);
        const user = await User.findOne({ username: 'username' });
        data.user = user;
        user.polls.push(data._id);
        await user.save();
        await data.save();
      })
    );
    console.log('CREATED POLLS', JSON.stringify(polls));
  } catch (err) {
    console.error(err);
  }
};

seed();
