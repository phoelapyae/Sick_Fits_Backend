import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema'
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import 'dotenv/config'
import { User } from './schemas/User';

const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial'

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 30,        // how long they stay sing in
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name','email','password']
        // TODO: Add in initial role here
    }
})

export default withAuth(
    config({
        // @ts-ignore
        server: {
            cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true
            }
        },
        db: {
            adapter: 'mongoose',
            url: databaseUrl,
            // TODO: Add data sending here
        },
        lists: createSchema({
            // schema items go in here
            User
        }),
        ui: {
            // Show the UI only for the people who pass this test
            isAccessAllowed: ({ session }) => {
                console.log(session);
                return !!session?.data
            },
        },
        // Add session values here
        session: withItemData(statelessSessions(sessionConfig), {
            User: `id name email`
        })
    })
);