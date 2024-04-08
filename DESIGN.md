h3. Mission Statement
Make it easy for people to propose and plan trips with their friends and family.

Users - Users of this application
id - primary key - string
email - unique - string
username - unique - string
name - string



Trips Schema - An trip, either proposed or planned.
id - primary - string
title - string
description - string
createdAt - date
updatedAd - date
owner - User
emails - array - string


Trip Page

/trips - see trips for user
TODO: /trips/new - create trip
TODO: /trips/$tripId - view single trip details

/trips/new
* Form to create trip
- title
- description
- list of emails to invite
