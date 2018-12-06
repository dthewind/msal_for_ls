to load:
npm install

to run (on the configured port of 4400):
npm run dev

-- will need to change b2c configuration in src/index.js starting line 42
-- or get login info for this tenant




open browser:
http://localhost:4400/

this will redirect to ms for authentication.  With appropriate login credentials, it will create an eternal loop.

file src/index.js
function htmlMode on line 35 is defaulted to the line that exists in the documentation and samples - if instead, you use the second line (line #37), you will stop the looping.

Another method to solve the issue is to NOT load the states (function @ line 90), let it log in and then you can reload the states.