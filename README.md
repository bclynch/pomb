# Pack On My Back

## Todos

### Migration Todos

- ~~Fix forms (bleh)~~
- ~~Hide disqus like edmflare~~
- ~~Fix dashboards (user and admin)~~
- ~~Asset creation / update / deletion testing:~~
    - ~~Trip~~
    - ~~Juncure~~
    - ~~Post~~
    - ~~Pics~~
- Fine tune UI experience against current prod
    - Hub module / trip posts bug
- Launch!
    - Push new build to vps
    - Update server

### Top Priorities

### Front end fixes live prod

- Fix defaulting end date when updating a trip and allowing to set back to null
- Update postgraphile to the beta. Otherwise check versioning across the board. Ionic when it goes to 4 (after it's stable... seriously wait its broken to update to prod)
- gallery photos are starting at end. Need to reverse the arr
- Browser fixes
- input focus colors (like contact / search)
- Run search algorithm - attempted...
- profile photo trip map
- Juncture page photo
- Adding images fails with too many + memory issues
- info window maps not opening with cluster mobile 
    - https://github.com/SebastianM/angular-google-maps/pull/1140
    - Might not be on npm version ?
- blog dash left thing overlapping issue
- Error getting to story hub from mobile menu
- Lazy loading imgs would be great... Verge does it on stories page
    - Can look at lazy loading modules too https://blog.cloudboost.io/angular-faster-performance-and-better-user-experience-with-lazy-loading-a4f323b2cf4a
- Froala being annoying... Thinking about Quill which is FOSS
    - https://quilljs.com/
    - https://github.com/KillerCodeMonkey/ngx-quill
    - Renderer - https://github.com/nozer/quill-delta-to-html
    - Custom image uploader - https://github.com/quilljs/quill/issues/1400
- Add apple web app meta tags
    - https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html

*AFTER ONLINE*

- Make sure we have efficient api calls and put some limiters on things like tripbyid so we dont get back all juncture or something when not required
- paginated hub page
- File drop https://github.com/georgipeltekov/ngx-file-drop
- Add countries still buggy
- google analytics for dev
- Maybe add search for manual junctures...
- Color transport icons white on recent nav
- Scheduled blog posts - hidden for now
- Preview for mobile blog dashboard
- published / drafted junctures
- Look into search indexing (or lack there of...)
    - Running REFRESH MATERIALZE VIEW pomb.index_name will do it. On a schedule or??https://www.apollographql.com/docs/react/features/cache-updates.html#after-mutations
- netflix style infinite scroll for junctures view?
- Google Analytics - Page views working at least (on CN email... Make domain email)
    - Track activities - https://codeburst.io/using-google-analytics-with-angular-25c93bffaa18
    - Set up reporting api calls - http://2ality.com/2015/10/google-analytics-api.html
        - https://stackoverflow.com/questions/12837748/analytics-google-api-error-403-user-does-not-have-any-google-analytics-account
- Need a way for user to reorder junctures or perhaps just by time ... need to consider
- Admin panels
- Search results view more - Look at reddit + maybe infinite scroll
- Think about sub trips ? i.e. a trek in the middle of a longer trip - Detour!
- Community hub - Map view of trips users have posted + some kind of way to explore various places
- Open graph stuff http://ogp.me/

## Logging Into Server

- SSH into server
    - `$ ssh <user>@<ip_address>`
    - `$ ssh bclynch@138.68.63.87`
- Switch user
    - `$ su - bclynch`
- Go to root
    - `$ exit`

## Development server

Run `$ ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app
will automatically reload if you change any of the source files.

## Graphql / Apollo

### Code Generation

#### Run

`$ npm run generate`

## Code scaffolding

Run `$ ng generate component component-name` to generate a new component. You
can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Feature Ideas

It would be fun to work on a few of these things:

**Interactive Map:**
https://developers.google.com/chart/interactive/docs/gallery/geochart
- Create base map that will create the geochart component
- Swap in own API key
- Extend base a ala https://stackoverflow.com/questions/37542408/angular2-google-charts-how-to-integrate-google-charts-in-angular2 for both a selector on the excursion explorer page AND one thats more personal showing places a user has been. Perhaps if one were to click on it it would take them to a hub of posts/tags they have about it? Dunno.
- Popover could be nice maybe.
- For exlorer would be nice to have a hub for each continent. Nice banner a la LP. Also have a map render for the continent so users can click from there

**Excursion Explorer:** 
App interface similar to lonely planet that shows information about various countries. Done this before. Look to those examples.

**Pack Diary:**
A centralized hub that a user can use to keep track of their trip. Look at something like polar steps or whatever for ideas. Probably like a day by day where am I + where'd I go. Could connect with the users blog posts as well. Interactive map would be perfect for this with points along the way that exhibit pictures, posts, etc. Can have a check in feature for users to snag their GPS coordinates to update progress. Maybe another hub to make trips public to inspire others.

**User Profile:**
Could create a front page of sorts for each user that has their own grid or look via user admin panel. Something to share with friends + commemorate trip. Perhaps have a way to show off multiple trips/filter by trip etc.

**Monetization:**
- Competitors: Polar Steps, Esplorio, inspirock

- Sponsored routes could be interesting. POMB would be used as a tracking/blogging tool for free to lure users, but non-obtrusive ads + sponsored routes could pay the bills. Travel companies around the world can gps their routes and show off what's avail to users. Get a cut or something of leads / conversions. Would need to flesh out the explore feature set and expand with hotels / activites / etc like lonely planet. Company accounts show off their trip options and user accounts.

- Company accounts could have their own accounts with subsequent dash to keep track of clciks / views etc. Custom comaany pages to show off their offerings and signups. Make these accounts premium with more analysis options etc.

- Most features available for free, but some premium like photo caps, private vs public posts, certain features. A couple bucks a year to stay premium. Maybe monthly? Seems like folks would only keep it as long as they're traveling. Maybe one off payments to post for a trip with limits to posts, pictures, etc but once it's there it's always there. Hard to say. 
- https://www.partner.viator.com/partner/home.jspa
- https://www.travelpayouts.com/
- http://developer.ean.com/