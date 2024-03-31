h3. Mission Statement
Make it easy for people to propose and plan trips with their friends and family.

Users - Users of this application
id - primary key - string
email - unique - string
username - unique - string
name - string



Trips - An trip, either proposed or planned.
id - primary - string
title - string
description - string
createdAt - date
updatedAd - date
owner - User
emails - array - string
