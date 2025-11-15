import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/socket.io',
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  afterInit(server: Server) {
    this.logger.log('Socket.IO Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    this.logger.log(`Message received from ${client.id}: ${data}`);
    return `Server received: ${data}`;
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    this.server.to(room).emit('room-joined', {
      clientId: client.id,
      room,
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    this.server.to(room).emit('room-left', {
      clientId: client.id,
      room,
    });
  }

  // Helper method to emit to all clients
  emitToAll(event: string, data: any): void {
    this.server.emit(event, data);
  }

  // Helper method to emit to specific room
  emitToRoom(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, data);
  }

  // Helper method to emit to specific client
  emitToClient(clientId: string, event: string, data: any): void {
    this.server.to(clientId).emit(event, data);
  }
}
