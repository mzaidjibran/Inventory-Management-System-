import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config({ path: './Application/Backend/.env' });

async function seed() {
  try {
    // Prefer exact loopback address; fall back to env
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Ecommerce';

    console.log('Connecting to MongoDB...', mongoURI);

    // Precompute password hash and admin payload so we can fallback if needed
    const plainPassword = 'admin123';
    const hash = await bcrypt.hash(plainPassword, 10);

    const adminData = {
      Name: 'Admin',
      email: 'admin@mango.com',
      password: hash,
      role: 'admin',
    };

    // Connection options: increase timeouts for diagnostics
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 20000,
        connectTimeoutMS: 30000,
      });
    } catch (connErr) {
      console.error('Mongo connect threw error:', connErr);
      throw connErr;
    }

    // Attach listeners for additional runtime diagnostics
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error event:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose disconnected');
    });

    console.log('✅ Connection Successful!');

    // Check karein ke connection ready hai ya nahi
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection is not ready yet.');
    }

    // Import model only after successful connection to avoid buffering issues
    const { default: User } = await import('./Application/Backend/models/UserModel.js');

    console.log('Creating or updating admin (upsert)...');

    const admin = await User.findOneAndUpdate(
      { email: 'admin@mango.com' },
      { $set: adminData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (admin) {
      console.log('✅ Admin ready:', admin.email, '| Role:', admin.role, '| Password: admin123');
    } else {
      console.warn('⚠️ Upsert returned no document.');
    }

  } catch (error) {
    console.error('❌ Error Message:', error.message);
    if (error.reason) console.error('🔍 Reason:', error.reason);
 
    // If DB is unreachable, write a fallback JSON with admin document and instructions
    try {
      const fallback = {
        note: 'Admin document to insert into the users collection. PasswordPlain is provided for convenience.',
        document: { ...adminData },
        passwordPlain: 'admin123',
        mongoShellInsert: `db.users.insertOne(${JSON.stringify({ ...adminData }, null, 2)})`,
      };

      const outPath = path.resolve(process.cwd(), 'admin-fallback.json');
      await fs.writeFile(outPath, JSON.stringify(fallback, null, 2), 'utf8');
      console.log('⚠️ MongoDB unreachable — wrote fallback to', outPath);
      console.log('You can import this JSON via MongoDB Compass or run the printed `mongoShellInsert` command.');
    } catch (fsErr) {
      console.error('Failed to write fallback file:', fsErr);
    }
  } finally {
    // Connection close karne se pehle check karein
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Connection closed.');
    }
    process.exit();
  }
}

seed();