"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
const common_1 = require("@nestjs/common");
let StateService = class StateService {
    static { StateService_1 = this; }
    static instance;
    state = new Map();
    listeners = new Map();
    constructor() {
        if (StateService_1.instance) {
            return StateService_1.instance;
        }
        StateService_1.instance = this;
    }
    set(key, value) {
        this.state.set(key, value);
        this.notifyListeners(key, value);
    }
    get(key) {
        return this.state.get(key);
    }
    has(key) {
        return this.state.has(key);
    }
    delete(key) {
        const result = this.state.delete(key);
        this.notifyListeners(key, undefined);
        return result;
    }
    getAll() {
        const result = {};
        for (const [key, value] of this.state.entries()) {
            result[key] = value;
        }
        return result;
    }
    clear() {
        this.state.clear();
        this.listeners.clear();
    }
    size() {
        return this.state.size;
    }
    update(key, updater) {
        const current = this.get(key);
        const newValue = updater(current);
        this.set(key, newValue);
    }
    increment(key, amount = 1) {
        const current = this.get(key) || 0;
        const newValue = current + amount;
        this.set(key, newValue);
        return newValue;
    }
    decrement(key, amount = 1) {
        const current = this.get(key) || 0;
        const newValue = current - amount;
        this.set(key, newValue);
        return newValue;
    }
    push(key, value) {
        const current = this.get(key) || [];
        if (Array.isArray(current)) {
            current.push(value);
            this.set(key, current);
        }
    }
    remove(key, value) {
        const current = this.get(key) || [];
        if (Array.isArray(current)) {
            const index = current.indexOf(value);
            if (index > -1) {
                current.splice(index, 1);
                this.set(key, current);
            }
        }
    }
    setProperty(key, property, value) {
        const current = this.get(key) || {};
        if (typeof current === 'object' && current !== null) {
            current[property] = value;
            this.set(key, current);
        }
    }
    removeProperty(key, property) {
        const current = this.get(key);
        if (typeof current === 'object' && current !== null) {
            delete current[property];
            this.set(key, current);
        }
    }
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);
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
    notifyListeners(key, value) {
        const listeners = this.listeners.get(key);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(value);
                }
                catch (error) {
                    console.error(`Error in state listener for key "${key}":`, error);
                }
            });
        }
    }
    getKeys(pattern) {
        const keys = Array.from(this.state.keys());
        if (!pattern) {
            return keys;
        }
        return keys.filter(key => key.includes(pattern));
    }
    setMultiple(updates) {
        for (const [key, value] of Object.entries(updates)) {
            this.set(key, value);
        }
    }
    getMultiple(keys) {
        const result = {};
        for (const key of keys) {
            result[key] = this.get(key);
        }
        return result;
    }
    backup() {
        return JSON.stringify(this.getAll());
    }
    restore(backup) {
        try {
            const data = JSON.parse(backup);
            this.clear();
            this.setMultiple(data);
        }
        catch (error) {
            throw new Error(`Failed to restore state: ${error.message}`);
        }
    }
};
exports.StateService = StateService;
exports.StateService = StateService = StateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StateService);
//# sourceMappingURL=state.service.js.map