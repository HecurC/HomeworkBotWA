const { Client, Location, Poll, List, Buttons, LocalAuth } = require('./index');

const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: { 
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: false
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (msg.body === '!живли') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'да');
    }  else if (msg.body === '!помощь') {
        client.sendMessage(msg.from, 'Список команд для вас:  !help - помощь \\n !живли - проверка на работоспособность...');
    }
    else if (msg.body === '!адпомощь') {
        client.sendMessage(msg.from, 'Список команд для богданчика: \\n !help - помощь \\n !живли - проверка на работоспособность...');
    }
    else if (msg.body === '!автор') {
        client.sendMessage(msg.from, 'Автор: Богдан (cursedo4) Серебрянский');
    }
    //else if (msg.body.startsWith('!sendto ')) {
    //     // Direct send a new message to specific id
    //     let number = msg.body.split(' ')[1];
    //     let messageIndex = msg.body.indexOf(number) + number.length;
    //     let message = msg.body.slice(messageIndex, msg.body.length);
    //     number = number.includes('@c.us') ? number : `${number}@c.us`;
    //     let chat = await msg.getChat();
    //     chat.sendSeen();
    //     client.sendMessage(number, message);
    // } 
    else if (msg.body.startsWith('!тема ')) {
        // Change the group subject
        let chat = await msg.getChat(); 
        if (chat.isGroup) {
            let newSubject = msg.body.slice(6);
            chat.setSubject(newSubject);
        } else {
            msg.reply('Эта команда работает только в группе!');
        }
    } else if (msg.body.startsWith('!эхо ')) {
        // Replies with the same message
        msg.reply(msg.body.slice(5));
    } 
    // else if (msg.body.startsWith('!preview ')) {
    //     const text = msg.body.slice(9);
    //     msg.reply(text, null, { linkPreview: true });
    // } 
    else if (msg.body.startsWith('!описание ')) {
        // Change the group description
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newDescription = msg.body.slice(10);
            chat.setDescription(newDescription);
        } else {
            msg.reply('Эта команда доступна только в группе!');
        }
    } else if (msg.body === '!покинуть') {
        // Leave the group
        let chat = await msg.getChat();
        if (chat.isGroup) {
            chat.leave();
        } else {
            msg.reply('Эта команда доступна только в группе!');
        }
    } else if (msg.body.startsWith('!присоединиться ')) {
        const inviteCode = msg.body.split(' ')[1];
        try {
            await client.acceptInvite(inviteCode);
            msg.reply('Присоединился! Вебсокеты настроены');
        } catch (e) {
            msg.reply('Ошибка: ', e);
        }
    } else if (msg.body.startsWith('!добавитьучастников')) {
        const group = await msg.getChat();
        const result = await group.addParticipants(['number1@c.us', 'number2@c.us', 'number3@c.us']);
        /**
         * The example of the {@link result} output:
         *
         * {
         *   'number1@c.us': {
         *     code: 200,
         *     message: 'The participant was added successfully',
         *     isInviteV4Sent: false
         *   },
         *   'number2@c.us': {
         *     code: 403,
         *     message: 'The participant can be added by sending private invitation only',
         *     isInviteV4Sent: true
         *   },
         *   'number3@c.us': {
         *     code: 404,
         *     message: 'The phone number is not registered on WhatsApp',
         *     isInviteV4Sent: false
         *   }
         * }
         *
         * For more usage examples:
         * @see https://github.com/pedroslopez/whatsapp-web.js/pull/2344#usage-example1
         */
        console.log(result);
    } else if (msg.body === '!создатьгруппу') {
        const partitipantsToAdd = ['number1@c.us', 'number2@c.us', 'number3@c.us'];
        const result = await client.createGroup('Group Title', partitipantsToAdd);
        /**
         * The example of the {@link result} output:
         * {
         *   title: 'Group Title',
         *   gid: {
         *     server: 'g.us',
         *     user: '1111111111',
         *     _serialized: '1111111111@g.us'
         *   },
         *   participants: {
         *     'botNumber@c.us': {
         *       statusCode: 200,
         *       message: 'The participant was added successfully',
         *       isGroupCreator: true,
         *       isInviteV4Sent: false
         *     },
         *     'number1@c.us': {
         *       statusCode: 200,
         *       message: 'The participant was added successfully',
         *       isGroupCreator: false,
         *       isInviteV4Sent: false
         *     },
         *     'number2@c.us': {
         *       statusCode: 403,
         *       message: 'The participant can be added by sending private invitation only',
         *       isGroupCreator: false,
         *       isInviteV4Sent: true
         *     },
         *     'number3@c.us': {
         *       statusCode: 404,
         *       message: 'The phone number is not registered on WhatsApp',
         *       isGroupCreator: false,
         *       isInviteV4Sent: false
         *     }
         *   }
         * }
         *
         * For more usage examples:
         * @see https://github.com/pedroslopez/whatsapp-web.js/pull/2344#usage-example2
         */
        console.log(result);
    } else if (msg.body === '!инфо') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`*Информация о группе*


                Название: ${chat.name}



                Описание: ${chat.description}



                Создана в: ${chat.createdAt.toString()}



                Создана: ${chat.owner.user}

                
                Количество участников: ${chat.participants.length}
            `);
        } else {
            msg.reply('Эта команда доступна только в группе!');
        }
    } else if (msg.body === '!чаты') {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `У бота открыто ${chats.length} чата(-oв).`);
    } else if (msg.body === '!конинфо') {
        let info = client.info;
        client.sendMessage(msg.from, `*Информация о соединении*
            Юзернейм: ${info.pushname}
            Номер: ${info.wid.user}
            Платформа: ${info.platform}
        `);
    } else if (msg.body === '!медиаинфо' && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            *Информация о медиа*
            Тип: ${attachmentData.mimetype}
            Имя файла: ${attachmentData.filename}
            Даталенгт (длина): ${attachmentData.data.length}
        `);
    } else if (msg.body === '!юзеринфо' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        quotedMsg.reply(`Айди: ${quotedMsg.id._serialized}


            Тип: ${quotedMsg.type}

            
            Автор: ${quotedMsg.author || quotedMsg.from}


            Таймштрих: ${quotedMsg.timestamp}


            Медиа: ${quotedMsg.hasMedia}
        `);
    } else if (msg.body === '!ресендмедиа' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { caption: 'Готово.' });
        }
        if (quotedMsg.hasMedia && quotedMsg.type === 'audio') {
            const audio = await quotedMsg.downloadMedia();
            await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });
        }
    } else if (msg.body === '!isviewonce' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const media = await quotedMsg.downloadMedia();
            await client.sendMessage(msg.from, media, { isViewOnce: true });
        }
    }
    //  else if (msg.body === '!локация') {
    //     // only latitude and longitude
    //     await msg.reply(new Location(37.422, -122.084));
    //     // location with name only
    //     await msg.reply(new Location(37.422, -122.084, { name: 'Googleplex' }));
    //     // location with address only
    //     await msg.reply(new Location(37.422, -122.084, { address: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA' }));
    //     // location with name, address and url
    //     await msg.reply(new Location(37.422, -122.084, { name: 'Googleplex', address: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA', url: 'https://google.com' }));
    // } 
    else if (msg.location) {
        msg.reply(msg.location);
    } 
    else if (msg.body.startsWith('!статус ')) {
        const newStatus = msg.body.split(' ')[1];
        await client.setStatus(newStatus);
        msg.reply(`Новый статус: *${newStatus}*`);
    } 
    // else if (msg.body === '!упомянутьюз') {
    //     const chat = await msg.getChat();
    //     const userNumber = 'XXXXXXXXXX';
    //     /**
    //      * To mention one user you can pass user's ID to 'mentions' property as is,
    //      * without wrapping it in Array, and a user's phone number to the message body:
    //      */
    //     await chat.sendMessage(`Привет! @${userNumber}`, {
    //         mentions: userNumber + '@c.us'
    //     });
    //     // To mention a list of users:
    //     await chat.sendMessage(`@${userNumber}, @${userNumber}`, {
    //         mentions: [userNumber + '@c.us', userNumber + '@c.us']
    //     });
    // } 
        else if (msg.body === '!упомянутьгр') {
        const chat = await msg.getChat();
        const groupId = 'YYYYYYYYYY@g.us';
        /**
         * Sends clickable group mentions, the same as user mentions.
         * When the mentions are clicked, it opens a chat with the mentioned group.
         * The 'groupMentions.subject' can be custom
         * 
         * @note The user that does not participate in the mentioned group,
         * will not be able to click on that mentioned group, the same if the group does not exist
         *
         * To mention one group:
         */
        await chat.sendMessage(`Проверь последнее сообщение здесь: @${groupId}`, {
            groupMentions: { subject: 'GroupSubject', id: groupId }
        });
        // To mention a list of groups:
        await chat.sendMessage(`Проверь последние сообщения в этих группах: @${groupId}, @${groupId}`, {
            groupMentions: [
                { subject: 'FirstGroup', id: groupId },
                { subject: 'SecondGroup', id: groupId }
            ]
        });
    } else if (msg.body === '!получитьУпоминаниевГруппе') {
        // To get group mentions from a message:
        const groupId = 'ZZZZZZZZZZ@g.us';
        const msg = await client.sendMessage('chatId', `Check the last message here: @${groupId}`, {
            groupMentions: { subject: 'GroupSubject', id: groupId }
        });
        /** {@link groupMentions} is an array of `GroupChat` */
        const groupMentions = await msg.getGroupMentions();
        console.log(groupMentions);
    } else if (msg.body === '!удалить') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                msg.reply('Невозможно удалить сообщение.');
            }
        }
    } else if (msg.body === '!пин') {
        const chat = await msg.getChat();
        await chat.pin();
    }
    else if (msg.body === '!анпин') {
        const chat = await msg.getChat();
        await chat.unpin();
    } else if (msg.body === '!архив') {
        const chat = await msg.getChat();
        await chat.archive();
    } else if (msg.body === '!мутчат') {
        const chat = await msg.getChat();
        // mute the chat for 20 seconds
        const unmuteDate = new Date();
        unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
        await chat.mute(unmuteDate);
    } else if (msg.body === '!писать') {
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
    } else if (msg.body === '!записывать') {
        const chat = await msg.getChat();
        // simulates recording audio in the chat
        chat.sendStateRecording();
    } else if (msg.body === '!очиститьстатус') {
        const chat = await msg.getChat();
        // stops typing or recording in the chat
        chat.clearState();
    } else if (msg.body === '!прыгнуть') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            client.interface.openChatWindowAt(quotedMsg.id._serialized);
        }
    } else if (msg.body === '!кнопки') {
        let button = new Buttons('Тело кнопки', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'Заголовок', 'Низ');
        client.sendMessage(msg.from, button);
    } else if (msg.body === '!лист') {
        let sections = [
            { title: 'sectionTitle', rows: [{ title: 'ListItem1', description: 'desc' }, { title: 'ListItem2' }] }
        ];
        let list = new List('List body', 'btnText', sections, 'Title', 'footer');
        client.sendMessage(msg.from, list);
    } else if (msg.body === '!реакция') {
        msg.react('👍');
    } else if (msg.body === '!полл') {
        /** By default the poll is created as a single choice poll: */
        await msg.reply(new Poll('Тело полла', ['Вариант 1', 'Вариант 2']));
        /** If you want to provide a multiple choice poll, add allowMultipleAnswers as true: */
        // await msg.reply(new Poll('Cats or Dogs?', ['Cats', 'Dogs'], { allowMultipleAnswers: true }));
        /**
         * You can provide a custom message secret, it can be used as a poll ID:
         * @note It has to be a unique vector with a length of 32
         */
        // await msg.reply(
        //     new Poll('Cats or Dogs?', ['Cats', 'Dogs'], {
        //         messageSecret: [
        //             1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        //         ]
        //     })
        // );
    } else if (msg.body === '!изменить') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.edit(msg.body.replace('!изменить', ''));
            } else {
                msg.reply('Невозможно изменить.');
            }
        }
    } else if (msg.body === '!обновитьЛейблы') {
        const chat = await msg.getChat();
        await chat.changeLabels([0, 1]);
    } else if (msg.body === '!добавитьЛейблы') {
        const chat = await msg.getChat();
        let labels = (await chat.getLabels()).map((l) => l.id);
        labels.push('0');
        labels.push('1');
        await chat.changeLabels(labels);
    } else if (msg.body === '!удалитьЛейблы') {
        const chat = await msg.getChat();
        await chat.changeLabels([]);
    } else if (msg.body === '!принятьреквест') {
        /**
         * Presented an example for membership request approvals, the same examples are for the request rejections.
         * To approve the membership request from a specific user:
         */
        await client.approveGroupMembershipRequests(msg.from, { requesterIds: 'number@c.us' });
        /** The same for execution on group object (no need to provide the group ID): */
        const group = await msg.getChat();
        await group.approveGroupMembershipRequests({ requesterIds: 'number@c.us' });
        /** To approve several membership requests: */
        const approval = await client.approveGroupMembershipRequests(msg.from, {
            requesterIds: ['number1@c.us', 'number2@c.us']
        });
        /**
         * The example of the {@link approval} output:
         * [
         *   {
         *     requesterId: 'number1@c.us',
         *     message: 'Rejected successfully'
         *   },
         *   {
         *     requesterId: 'number2@c.us',
         *     error: 404,
         *     message: 'ParticipantRequestNotFoundError'
         *   }
         * ]
         *
         */
        console.log(approval);
        /** To approve all the existing membership requests (simply don't provide any user IDs): */
        await client.approveGroupMembershipRequests(msg.from);
        /** To change the sleep value to 300 ms: */
        await client.approveGroupMembershipRequests(msg.from, {
            requesterIds: ['number1@c.us', 'number2@c.us'],
            sleep: 300
        });
        /** To change the sleep value to random value between 100 and 300 ms: */
        await client.approveGroupMembershipRequests(msg.from, {
            requesterIds: ['number1@c.us', 'number2@c.us'],
            sleep: [100, 300]
        });
        /** To explicitly disable the sleep: */
        await client.approveGroupMembershipRequests(msg.from, {
            requesterIds: ['number1@c.us', 'number2@c.us'],
            sleep: null
        });
    } else {
        /**
         * Pins a message in a chat, a method takes a number in seconds for the message to be pinned.
         * WhatsApp default values for duration to pass to the method are:
         * 1. 86400 for 24 hours
         * 2. 604800 for 7 days
         * 3. 2592000 for 30 days
         * You can pass your own value:
         */
        const result = await client.sendMessage("Команда не найдена! Перепроверьте синтаксис"); // Will pin a message for 1 minute
        console.log(result); // True if the operation completed successfully, false otherwise
    }
});

client.on('message_create', async (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }

    // // Unpins a message
    // if (msg.fromMe && msg.body.startsWith('!анпин')) {
    //     const pinnedMsg = await msg.getQuotedMessage();
    //     if (pinnedMsg) {
    //         // Will unpin a message
    //         const result = await pinnedMsg.unpin();
    //         console.log(result); // True if the operation completed successfully, false otherwise
    //     }
    // }
});

client.on('message_ciphertext', (msg) => {
    // Receiving new incoming messages that have been encrypted
    // msg.type === 'ciphertext'
    msg.body = 'Waiting for this message. Check your phone.';
    
    // do stuff here
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if (ack == 3) {
        // The message was read
    }
});

client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state);
});

// Change to false if you don't want to reject incoming calls
let rejectCalls = true;

client.on('call', async (call) => {
    console.log('Call received, rejecting. GOTO Line 261 to disable', call);
    if (rejectCalls) await call.reject();
    await client.sendMessage(call.from, `[${call.fromMe ? 'Outgoing' : 'Incoming'}] Phone call from ${call.from}, type ${call.isGroup ? 'group' : ''} ${call.isVideo ? 'video' : 'audio'} call. ${rejectCalls ? 'This call was automatically rejected by the script.' : ''}`);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.on('contact_changed', async (message, oldId, newId, isContact) => {
    /** The time the event occurred. */
    const eventTime = (new Date(message.timestamp * 1000)).toLocaleString();

    console.log(
        `The contact ${oldId.slice(0, -5)}` +
        `${!isContact ? ' that participates in group ' +
            `${(await client.getChatById(message.to ?? message.from)).name} ` : ' '}` +
        `changed their phone number\nat ${eventTime}.\n` +
        `Their new phone number is ${newId.slice(0, -5)}.\n`);

    /**
     * Information about the @param {message}:
     * 
     * 1. If a notification was emitted due to a group participant changing their phone number:
     * @param {message.author} is a participant's id before the change.
     * @param {message.recipients[0]} is a participant's id after the change (a new one).
     * 
     * 1.1 If the contact who changed their number WAS in the current user's contact list at the time of the change:
     * @param {message.to} is a group chat id the event was emitted in.
     * @param {message.from} is a current user's id that got an notification message in the group.
     * Also the @param {message.fromMe} is TRUE.
     * 
     * 1.2 Otherwise:
     * @param {message.from} is a group chat id the event was emitted in.
     * @param {message.to} is @type {undefined}.
     * Also @param {message.fromMe} is FALSE.
     * 
     * 2. If a notification was emitted due to a contact changing their phone number:
     * @param {message.templateParams} is an array of two user's ids:
     * the old (before the change) and a new one, stored in alphabetical order.
     * @param {message.from} is a current user's id that has a chat with a user,
     * whos phone number was changed.
     * @param {message.to} is a user's id (after the change), the current user has a chat with.
     */
});

client.on('group_admin_changed', (notification) => {
    if (notification.type === 'promote') {
        /** 
          * Emitted when a current user is promoted to an admin.
          * {@link notification.author} is a user who performs the action of promoting/demoting the current user.
          */
        client.sendMessage(msg.from, `${notification.author} выдал ${notification.recipientIds} админку!`);
    } else if (notification.type === 'demote')
        /** Emitted when a current user is demoted to a regular user. */
        client.sendMessage(msg.from, `${notification.author} забрал у ${notification.recipientIds} админку!`);
});

client.on('group_membership_request', async (notification) => {
    /**
     * The example of the {@link notification} output:
     * {
     *     id: {
     *         fromMe: false,
     *         remote: 'groupId@g.us',
     *         id: '123123123132132132',
     *         participant: 'number@c.us',
     *         _serialized: 'false_groupId@g.us_123123123132132132_number@c.us'
     *     },
     *     body: '',
     *     type: 'created_membership_requests',
     *     timestamp: 1694456538,
     *     chatId: 'groupId@g.us',
     *     author: 'number@c.us',
     *     recipientIds: []
     * }
     *
     */
    console.log(notification);
    /** You can approve or reject the newly appeared membership request: */
    await client.approveGroupMembershipRequestss(notification.chatId, notification.author);
    await client.rejectGroupMembershipRequests(notification.chatId, notification.author);
});