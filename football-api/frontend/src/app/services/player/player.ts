// src/app/services/player.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  id: number;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;
}

export interface PlayerQuery {
  name?: string;
  club?: string;
  position?: string;
  nationality?: string;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface PaginatedPlayers {
  items: Player[];
  total: number;
  page: number;
  limit: number;
}

export interface PlayerFormData {
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}/${id}`);
  }

  getPlayers(query: PlayerQuery): Observable<PaginatedPlayers> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PaginatedPlayers>(this.baseUrl, { params });
  }

  exportPlayers(query: Omit<PlayerQuery, 'page' | 'limit'>): Observable<string> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'text',
    });
  }

  createPlayer(player: PlayerFormData): Observable<Player> {
    return this.http.post<Player>(this.baseUrl, player);
  }

  updatePlayer(id: number, player: PlayerFormData): Observable<Player> {
    return this.http.patch<Player>(`${this.baseUrl}/${id}`, player);
  }
}
