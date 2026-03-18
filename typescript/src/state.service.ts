import { Injectable } from '@nestjs/common';

/**
 * 메모리 기반 전역 State 관리 서비스
 * 서버 내부에서 간단한 상태 관리를 위한 싱글톤 서비스
 */
@Injectable()
export class StateService {
  private static instance: StateService;
  private state: Map<string, any> = new Map();
  private listeners: Map<string, Set<(value: any) => void>> = new Map();

  constructor() {
    if (StateService.instance) {
      return StateService.instance;
    }
    StateService.instance = this;
  }

  /**
   * State 값 설정
   */
  set(key: string, value: any): void {
    this.state.set(key, value);
    this.notifyListeners(key, value);
  }

  /**
   * State 값 조회
   */
  get(key: string): any {
    return this.state.get(key);
  }

  /**
   * State 값이 존재하는지 확인
   */
  has(key: string): boolean {
    return this.state.has(key);
  }

  /**
   * State 값 삭제
   */
  delete(key: string): boolean {
    const result = this.state.delete(key);
    this.notifyListeners(key, undefined);
    return result;
  }

  /**
   * 모든 State 조회
   */
  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of this.state.entries()) {
      result[key] = value;
    }
    return result;
  }

  /**
   * 모든 State 삭제
   */
  clear(): void {
    this.state.clear();
    this.listeners.clear();
  }

  /**
   * State 개수 조회
   */
  size(): number {
    return this.state.size;
  }

  /**
   * State 값 업데이트 (기존 값과 병합)
   */
  update(key: string, updater: (current: any) => any): void {
    const current = this.get(key);
    const newValue = updater(current);
    this.set(key, newValue);
  }

  /**
   * State 값 증가 (숫자인 경우)
   */
  increment(key: string, amount: number = 1): number {
    const current = this.get(key) || 0;
    const newValue = current + amount;
    this.set(key, newValue);
    return newValue;
  }

  /**
   * State 값 감소 (숫자인 경우)
   */
  decrement(key: string, amount: number = 1): number {
    const current = this.get(key) || 0;
    const newValue = current - amount;
    this.set(key, newValue);
    return newValue;
  }

  /**
   * 배열에 값 추가
   */
  push(key: string, value: any): void {
    const current = this.get(key) || [];
    if (Array.isArray(current)) {
      current.push(value);
      this.set(key, current);
    }
  }

  /**
   * 배열에서 값 제거
   */
  remove(key: string, value: any): void {
    const current = this.get(key) || [];
    if (Array.isArray(current)) {
      const index = current.indexOf(value);
      if (index > -1) {
        current.splice(index, 1);
        this.set(key, current);
      }
    }
  }

  /**
   * 객체에 속성 추가/업데이트
   */
  setProperty(key: string, property: string, value: any): void {
    const current = this.get(key) || {};
    if (typeof current === 'object' && current !== null) {
      current[property] = value;
      this.set(key, current);
    }
  }

  /**
   * 객체에서 속성 제거
   */
  removeProperty(key: string, property: string): void {
    const current = this.get(key);
    if (typeof current === 'object' && current !== null) {
      delete current[property];
      this.set(key, current);
    }
  }

  /**
   * State 변경 리스너 등록
   */
  subscribe(key: string, callback: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // 구독 해제 함수 반환
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  /**
   * 리스너들에게 변경사항 알림
   */
  private notifyListeners(key: string, value: any): void {
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error(`Error in state listener for key "${key}":`, error);
        }
      });
    }
  }

  /**
   * 특정 패턴과 일치하는 키들 조회
   */
  getKeys(pattern?: string): string[] {
    const keys = Array.from(this.state.keys());
    if (!pattern) {
      return keys;
    }
    return keys.filter(key => key.includes(pattern));
  }

  /**
   * State 값들을 일괄 설정
   */
  setMultiple(updates: Record<string, any>): void {
    for (const [key, value] of Object.entries(updates)) {
      this.set(key, value);
    }
  }

  /**
   * State 값들을 일괄 조회
   */
  getMultiple(keys: string[]): Record<string, any> {
    const result: Record<string, any> = {};
    for (const key of keys) {
      result[key] = this.get(key);
    }
    return result;
  }

  /**
   * State 백업 (JSON 문자열로)
   */
  backup(): string {
    return JSON.stringify(this.getAll());
  }

  /**
   * State 복원 (JSON 문자열에서)
   */
  restore(backup: string): void {
    try {
      const data = JSON.parse(backup);
      this.clear();
      this.setMultiple(data);
    } catch (error) {
      throw new Error(`Failed to restore state: ${error.message}`);
    }
  }
}
