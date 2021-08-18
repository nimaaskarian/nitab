# Nitab
A Neat, advanced and customizable start page for your chrome. written in JavaScript and React.

## Features
- **Adding [commands](#commands)** will make your life easier !
- **Changing default command [identifier](#identifier)** so it fits your style !
- **Adding [Todo](#todo)** to never forget what you wanted to-do !
- **Customizing [clock](#clock) position and align** so it will seat where you're comfortable !
- **Customizing [background](#background)** to fully enjoy your neatness.
- **Customizing [foreground](#foreground) color** so it fits your background.
- **Design your own [taskbar](#taskbar)** to achive a prefect combination of neatness and usefulness.
- **[Autocomplete](#Autocomplete)** will speed up your internet browsing.


## Commands
you can add your own command or override existing commands.
<br/>
then you can run the added command using `[iden][commandName] [commandArgs]`.
<br/>
replace `[iden]` with your command [identifier](#identifier) (default:/).


### Single URL
to add a single URL command, `[iden]command [commandName:string] URL`

##### Example: 
* `/command git https://github.com/`
* `command ig instagram.com`
* `-command rt https://www.rottentomatoes.com/`


### Multiple URL
to add a Multiple URL command, `[iden]command commandName URL1 URL2 URL3 URLN`

##### Example: 
* `/command web cssgradient.io www.w3schools.com https://developer.mozilla.org/en-US/docs/ stackoverflow.com github.com`

### Advanced
#### Including command arguments
look at this example: `[iden]commandName commandArguments`.
<br/>
if you want to use command arguments in your command, you can use %input% keyword in your URL.
<br/>
for example, and you made a command like this: `[iden]utube www.youtube.com/results?search_query=%input%`
<br/>
`[iden]utube mosh hamedani` will open www.youtube.com/results?search_query=mosh%20hamedani for you.


## Identifier
## Todo
## Clock
## Background
## Foreground
## Taskbar 
## Autocomplete
