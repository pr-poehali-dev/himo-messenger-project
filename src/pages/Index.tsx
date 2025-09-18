import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  himcoins: number;
  isPremium: boolean;
  isVerified: boolean;
  isBanned: boolean;
  friends: string[];
  joinDate: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: 'direct' | 'group' | 'channel';
  participants: string[];
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user_001',
    username: 'john_doe',
    displayName: 'John Doe',
    avatar: '/placeholder.svg',
    himcoins: 350,
    isPremium: false,
    isVerified: false,
    isBanned: false,
    friends: ['himo'],
    joinDate: '2024-01-15'
  });

  const [users] = useState<User[]>([
    {
      id: 'himo',
      username: 'Himo',
      displayName: 'Himo Admin',
      avatar: '/placeholder.svg',
      himcoins: 99999,
      isPremium: true,
      isVerified: true,
      isBanned: false,
      friends: ['user_001'],
      joinDate: '2023-01-01'
    },
    currentUser
  ]);

  const [chats] = useState<Chat[]>([
    {
      id: 'chat_001',
      name: 'Himo Admin',
      lastMessage: 'Добро пожаловать в Himo Messenger!',
      timestamp: '14:30',
      unread: 1,
      type: 'direct',
      participants: ['himo', 'user_001']
    },
    {
      id: 'chat_002',
      name: 'Общий канал',
      lastMessage: 'Новости и объявления',
      timestamp: '12:15',
      unread: 0,
      type: 'channel',
      participants: ['himo', 'user_001']
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<string>('chat_001');
  const [activeTab, setActiveTab] = useState('chats');
  const [newMessage, setNewMessage] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const isAdmin = currentUser.username === 'Himo';

  const handleDailyReward = () => {
    setCurrentUser(prev => ({
      ...prev,
      himcoins: prev.himcoins + 100
    }));
  };

  const handlePremiumUpgrade = () => {
    if (currentUser.himcoins >= 500) {
      setCurrentUser(prev => ({
        ...prev,
        himcoins: prev.himcoins - 500,
        isPremium: true
      }));
    }
  };

  const renderChatList = () => (
    <div className="space-y-2">
      {chats.map((chat) => (
        <Card 
          key={chat.id}
          className={`cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
            selectedChat === chat.id ? 'bg-primary/10 border-primary' : ''
          }`}
          onClick={() => setSelectedChat(chat.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{chat.name}</p>
                  {chat.type === 'channel' && <Icon name="Hash" size={16} className="text-muted-foreground" />}
                  {chat.type === 'group' && <Icon name="Users" size={16} className="text-muted-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                {chat.unread > 0 && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFriendsList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Друзья</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Icon name="UserPlus" size={16} className="mr-2" />
              Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить друга</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="friend-id">ID пользователя</Label>
                <Input id="friend-id" placeholder="Введите ID пользователя" />
              </div>
              <Button className="w-full">Отправить заявку</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {currentUser.friends.map((friendId) => {
        const friend = users.find(u => u.id === friendId);
        if (!friend) return null;
        
        return (
          <Card key={friend.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{friend.displayName}</p>
                    {friend.isPremium && <Badge variant="secondary" className="bg-himo-gold/20 text-himo-gold border-himo-gold">+</Badge>}
                    {friend.isVerified && <Icon name="CheckCircle" size={16} className="text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">@{friend.username}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Icon name="MessageCircle" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="User" size={20} />
            Мой профиль
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{currentUser.displayName}</h3>
                {currentUser.isPremium && (
                  <Badge variant="secondary" className="bg-himo-gold/20 text-himo-gold border-himo-gold">
                    Himo+ 
                  </Badge>
                )}
                {currentUser.isVerified && <Icon name="CheckCircle" size={18} className="text-primary" />}
              </div>
              <p className="text-muted-foreground">@{currentUser.username}</p>
              <p className="text-sm text-muted-foreground">ID: {currentUser.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display-name">Отображаемое имя</Label>
              <Input id="display-name" value={currentUser.displayName} />
            </div>
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input 
                id="username" 
                value={currentUser.username} 
                disabled={!currentUser.isPremium}
              />
              {!currentUser.isPremium && (
                <p className="text-xs text-muted-foreground mt-1">
                  Доступно только для Himo+ пользователей
                </p>
              )}
            </div>
          </div>

          <Button className="w-full">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить изменения
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Coins" size={20} className="text-himo-gold" />
            HimCoins
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-himo-gold">{currentUser.himcoins}</div>
            <p className="text-muted-foreground">HimCoins</p>
          </div>

          <Button 
            onClick={handleDailyReward}
            className="w-full"
            variant="outline"
          >
            <Icon name="Gift" size={16} className="mr-2" />
            Получить ежедневную награду (+100)
          </Button>

          {!currentUser.isPremium && (
            <Card className="border-himo-gold bg-himo-gold/5">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <h4 className="font-semibold">Himo Messenger+</h4>
                  <p className="text-sm text-muted-foreground">
                    Получите золотой значок и возможность изменить свой ID
                  </p>
                  <div className="text-2xl font-bold text-himo-gold">500 HimCoins</div>
                  <Button 
                    onClick={handlePremiumUpgrade}
                    disabled={currentUser.himcoins < 500}
                    className="w-full bg-himo-gold hover:bg-himo-gold/90 text-black"
                  >
                    Получить Himo+
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminPanel = () => {
    if (!isAdmin) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Shield" size={20} />
              Админ панель
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-sm text-muted-foreground">Пользователей</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground">Активных жалоб</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{chats.length}</div>
                  <p className="text-sm text-muted-foreground">Активных чатов</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Управление пользователями</h4>
              {users.filter(u => u.id !== 'himo').map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Icon name="CheckCircle" size={16} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="MessageSquare" size={16} />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Icon name="Ban" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderChatWindow = () => {
    const chat = chats.find(c => c.id === selectedChat);
    if (!chat) return null;

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{chat.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{chat.name}</h3>
              <p className="text-sm text-muted-foreground">
                {chat.type === 'channel' ? 'Канал' : 'В сети'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>H</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Himo</span>
                <Badge variant="secondary" className="bg-himo-gold/20 text-himo-gold border-himo-gold text-xs">+</Badge>
                <span className="text-xs text-muted-foreground">14:30</span>
              </div>
              <p className="mt-1 bg-muted p-3 rounded-lg">
                Добро пожаловать в Himo Messenger! 🚀
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button>
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Himo Messenger</h1>
          <Dialog open={showAuth} onOpenChange={setShowAuth}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isLoginMode ? 'Вход' : 'Регистрация'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input id="username" placeholder="Введите имя пользователя" />
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input id="password" type="password" placeholder="Введите пароль" />
                </div>
                {!isLoginMode && (
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Введите email" />
                  </div>
                )}
                <Button className="w-full">
                  {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
                </Button>
                <Button 
                  variant="link" 
                  className="w-full"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                >
                  {isLoginMode ? 'Нет аккаунта? Регистрация' : 'Есть аккаунт? Войти'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex h-screen lg:h-[calc(100vh-0px)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-80 border-r bg-card">
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold">Himo Messenger</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Профессиональное общение
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4 m-4">
                <TabsTrigger value="chats" className="text-xs">
                  <Icon name="MessageCircle" size={16} className="mr-1" />
                  Чаты
                </TabsTrigger>
                <TabsTrigger value="friends" className="text-xs">
                  <Icon name="Users" size={16} className="mr-1" />
                  Друзья
                </TabsTrigger>
                <TabsTrigger value="profile" className="text-xs">
                  <Icon name="User" size={16} className="mr-1" />
                  Профиль
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin" className="text-xs">
                    <Icon name="Shield" size={16} className="mr-1" />
                    Админ
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="chats" className="h-full p-4 pt-0">
                  {renderChatList()}
                </TabsContent>
                <TabsContent value="friends" className="h-full p-4 pt-0">
                  {renderFriendsList()}
                </TabsContent>
                <TabsContent value="profile" className="h-full p-4 pt-0 overflow-y-auto">
                  {renderProfile()}
                </TabsContent>
                {isAdmin && (
                  <TabsContent value="admin" className="h-full p-4 pt-0 overflow-y-auto">
                    {renderAdminPanel()}
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chats">
                  <Icon name="MessageCircle" size={16} />
                </TabsTrigger>
                <TabsTrigger value="friends">
                  <Icon name="Users" size={16} />
                </TabsTrigger>
                <TabsTrigger value="profile">
                  <Icon name="User" size={16} />
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin">
                    <Icon name="Shield" size={16} />
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="p-4">
                <TabsContent value="chats">{renderChatList()}</TabsContent>
                <TabsContent value="friends">{renderFriendsList()}</TabsContent>
                <TabsContent value="profile">{renderProfile()}</TabsContent>
                {isAdmin && <TabsContent value="admin">{renderAdminPanel()}</TabsContent>}
              </div>
            </Tabs>
          </div>

          {/* Desktop Chat Window */}
          <div className="hidden lg:block flex-1">
            {renderChatWindow()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;