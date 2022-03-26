# Nitab
A Neat, advanced and customizable start page for your browser. written in JavaScript and React.

# Features
- **Adding [commands](#commands)** will make your life easier !
- **Changing default command [identifier](#identifier)** so it fits your style !
- **Adding [Todo](#todo)** to never forget what you wanted to-do !
- **Customizing [clock](#clock) position and align** so it will seat where you're comfortable !
- **Customizing [background](#background)** to fully enjoy your neatness.
- **Customizing [foreground](#foreground) color** so it fits your background.
- **Design your own [taskbar](#taskbar)** to achive a prefect combination of neatness and usefulness.
- **[Autocomplete](#Autocomplete)** will speed up your internet browsing.


# Commands
you can add your own command or override existing commands.
<br/>
then you can run the added command using `[iden][commandName] [commandArgs]`.
<br/>
replace `[iden]` with your command [identifier](#identifier) (default:/).

## Adding a command
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
<br/>
you can use this in all type of commands

#### determine if arguments exist or not
if you want your command to detect if you have typed a command argument or not, you can use %?% keyword between your two urls.
<br/>
`[iden]commandName `
<br/>
for example, if you have a command like this: `[iden]ytOrIg youtube.com%?%instagram.com` and you type `[iden]ytOrIg` 


# Identifier
The character or string of characters that cause Nitab to understand that you're typing a command. (default is `/`)
# Todo
One of the defaults commands that allow you to set a reminder (todo) for yourself. you can use it using the following syntax:  
`[iden]todo walk the dog`  
you can temporarily delete a todo using the X icon or you can permanently delete it via clicking on its circle.
# Clock
# Background
You can set Nitab's background using a proper css background value using the follwoing syntax:  
`[iden]bg cssBackgroundValue`  
for example:  
`[iden]bg white`  
`[iden]bg url("somedomain/path/to/wallpaper.jpg")`  
`[iden]bg linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)`  
and etc
# Foreground
you can change text color (foreground color) using the following syntax:  
`[iden]fg properCssColor`  
for example:  
`[iden]fg white`  
`[iden]fg #b19ed4`  
`[iden]fg rgb(104, 111, 207)`  
you can override other commands color using `ovr` before the css color:  
`[iden]fg ovr white`  
and etc

# Taskbar 
if you add icons to your taskbar, they will apear at the bottom of the main(clock) page. they will be also accessible using alt + <num-keys>
## Taskbar Icons
you can add them using a GUI modal after calling `[iden]taskbar` command.  
set a icon from fontawesome 6 free icon pack (required)
you can select a icon using clicks. or you can delete it using double clicks. you can add for change its place by drag and dropping. 
you can also set margin for better organizing 
# Autocomplete
theres a autocomplete feature that can suggest up to 8 search terms or urls. very useful if you ask me!
