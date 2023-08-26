# telegram-bot-maker

<div>
  <img width="250" src=https://github.com/tawsbob/telegram-bot-maker/blob/master/docs/the-bot-father.jpg?raw=true">
</div>

A nodejs lightweight library wrapper to [telegram bot api](https://core.telegram.org/bots/api)

## Learn More about telegram bots

if you want learn more about [Telegram bots](https://core.telegram.org/bots)

## How did it come about?

After try make may own bot with currents nodejs libraries ( Telegraf and others) and face some issues like:

- Uncaught exception
- Bugs, memory leaks
- About weeks to accept pull request with bugfix
- Very verbose to work listening to answers and creating buttons / menus

That module arose from my need to create a bot, so I needed to quickly develop a module that would meet my needs, so I didn't bother to implement all the methods / features available in the telegram API.

**My only concern was to develop code that didn't break the application.**

#### If you want to help implement new features or improve code quality, your help is most welcome! 😊

## Requirements

- Nodejs V8 +

## Limitations

It's only for long polling bot, **Webhook** will be implemented soon. Feel free to help us!

## Install

```bash
$ npm install telegram-bot-maker
```

## Usage

```javascript
const { Bot } = require("telegram-bot-maker");

const bot = new Bot({
  token: "YOUR-BOT-TOKEN",
  updateInterval: 500, // interval that bot will looking for updates
});

bot.lauch();
```

## Bot Methods

Start the bot

```javascript
bot.lauch();
```

Stop the bot

```javascript
bot.stop();
```

Add listener to command

```javascript
// * Is Required
//<String> command *
//<Function> handler *
bot.command(command, handler);

//exemple
bot.command("/menu", (ctx, update) => {
  ctx.reply("There is a reply to menu command");
});
```

Add listener to bot

```javascript
// * Is Required
//<String> listener * 'message' || 'update'
//<Function> handler *
bot.on(listener, handler);

//exemple
bot.on("message", (ctx, update) => {
  ctx.reply("A reply to your msg");
});
```

## Wait For User reply

![Wait for user reply](https://github.com/tawsbob/telegram-bot-maker/blob/master/docs/reply.gif?raw=true)

ctx.waitForReply(handler)

```javascript
bot.on("message", (ctx, update) => {
  ctx
    .reply("Whats is your first name?")
    .waitForReply((userReply) => {
      const { message } = userReply;
      ctx.setState({ firstName: message.text });
      ctx.reply(`nice ${message.text}, so whats is your last name?`);
    })
    .waitForReply((userReply) => {
      const { message } = userReply;
      const { firstName } = ctx.getState();
      ctx.reply(`your full name is ${firstName} ${message.text}`);
    });
});
```

## Creating Menu

![Menu 2x1](https://github.com/tawsbob/telegram-bot-maker/blob/master/docs/menu-exemple-1.png?raw=true)

ctx.replyWithMenu(MenuSettings)

```javascript
bot.on("message", (ctx, update) => {
  ctx.replyWithMenu({
    text: "Menu Level 0", //<String> text                       ( Text of message )
    grid: "2x1", //<String> grid *Required 'ColsxRow'  ( Grid of the Menu )
    id: "id-menu-0", //<String> id *Required               (Id of menu, without it backButton wont work)
    options: [
      {
        label: "Button 1", //<String> label *Required           (Label of button)
        id: "btn-1", //<String> id *Required              (Id of button)
        params: { foo: "bar" }, //<Object> params              (Your custom params if you need)
        onSelect: (params) => {
          console.log("Button 1 click", params);
          //Output: Button 1 click { 'foo': 'bar' }
        }, //<Function> onSelect *Required       (Called when user press the button)
      },
      {
        label: "Button 2",
        id: "btn-2",
        onSelect: (params) => {
          console.log("Button 2 click");
        },
      },
    ],
  });
});
```

## Submenu

![Menu 1x1](https://github.com/tawsbob/telegram-bot-maker/blob/master/docs/submenu-exemple.gif?raw=true)

```javascript
bot.on("message", (ctx, update) => {
  ctx.replyWithMenu({
    text: "Menu Level 0",
    grid: "2x1",
    id: "id-menu-0",
    options: [
      {
        label: "Button 1",
        id: "btn-1",
        params: { "my-custom-params": "my-custom-value" },
        onSelect: (params) => {
          console.log("Button 1 click", params);
        },
      },
      {
        label: "Button 2",
        id: "btn-2",
        onSelect: (params) => {
          console.log("Button 2 click");
        },
        submenu: {
          text: "Menu Level 1",
          grid: "1x1",
          id: "id-menu-1",
          backButton: {
            label: "Back to level zero menu",
            id: "id-menu-0",
          }, // Add at the bottom of grid a back button
          options: [
            {
              label: "Button 3",
              id: "btn-3",
              onSelect: (params) => {
                console.log("Button 3 click");
              },
            },
            {
              label: "Button 4",
              id: "btn-4",
              onSelect: (params) => {
                console.log("Button 4 click");
              },
            },
          ],
        },
      },
    ],
  });
});
```

## Custom Inline Buttons

![Custom inline btn](https://github.com/tawsbob/telegram-bot-maker/blob/master/docs/custom-inline-btns.gif?raw=true)

```javascript
bot.on("message", (ctx, update) => {
  ctx.reply(
    "Testing custom BTNS",
    ctx.keyboard("inline", [
      [
        ctx.buttons.CallBack(
          "Button 1",
          "id-btn-1",
          { params: "to-btn-1" },
          (params) => {
            console.log("User hit button 1", params);
          }
        ),
      ],
      [
        ctx.buttons.CallBack(
          "Button 2",
          "id-btn-2",
          { params: "to-btn-2" },
          (params) => {
            console.log("User hit button 2", params);
          }
        ),
      ],
    ])
  );
});
```

## Custom Buttons

![Custom btn](https://github.com/tawsbob/telegram-bot-maker/blob/master/docs/custom-btns.gif?raw=true)

```javascript
bot.on("message", (ctx, update) => {
  ctx.reply(
    "Testing custom BTNS",
    ctx.keyboard(null, [
      //Just the inline params changed
      [
        ctx.buttons.CallBack(
          "Button 1",
          "id-btn-1",
          { params: "to-btn-1" },
          (params) => {
            console.log("User hit button 1", params);
          }
        ),
      ],
      [
        ctx.buttons.CallBack(
          "Button 2",
          "id-btn-2",
          { params: "to-btn-2" },
          (params) => {
            console.log("User hit button 2", params);
          }
        ),
      ],
    ])
  );
});
```

## send Photos to user

![Send Image](https://github.com/tawsbob/telegram-bot-maker/blob/master/docs/send-img.gif?raw=true)

To send photos to user you must pass url or filePath param.

```javascript
ctx.reply("Want a photo?").waitForReply(() => {
  ctx.replyWithImage({
    file: {
      type: "photo", // Is required
      //url: 'https://images.freeimages.com/images/large-previews/b31/butterfly-1392408.jpg',
      filePath: "./docs/menu-exemple-1.png",
    },
  });
});
```

## Availables Api Methods

- getMe
- sendMessage
- forwardMessage
- sendPhoto
- sendAudio
- sendDocument
- sendVideo
- sendAnimation
- sendVoice
- sendVideoNote
- sendMediaGroup
- sendLocation
- editMessageLiveLocation
- stopMessageLiveLocation
- sendVenue
- sendContact
- sendPoll
- sendChatAction
- getUserProfilePhotos
- editMessageText

## Notes

All updates that remain when the bot is off will be bypassed, it will only react to updates that happen while it is alive, I choose for this architecture to prevent anomalous behavior.

**This module is in its infancy and still relies on possible help to make it more robust.**
