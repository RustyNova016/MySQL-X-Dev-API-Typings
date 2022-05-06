/**
 * Copyright 2019, Danang Galuh Tegar Prasetyo.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TableDelete from './TableDelete'
import TableInsert from './TableInsert'
import TableSelect from './TableSelect'
import TableUpdate from './TableUpdate'
import {IClient, ISchema, ISession, ITable, ITableDelete, ITableInsert, ITableSelect, ITableUpdate} from './interfaces'
import {SearchCondition, SearchConditionString} from './types'
import {createConditionString} from "./tools/CreateConditionString";

export class Table implements ITable {
    private readonly schema: ISchema
    private readonly xTable: any

    constructor(schema: ISchema, xTable: any) {
        this.schema = schema
        this.xTable = xTable
    }

    public getClient(): IClient | null {
        return this.schema.getClient()
    }

    public getSession(): ISession {
        return this.schema.getSession()
    }

    public getSchema(): ISchema {
        return this.schema
    }

    /** Return the raw mysql X dev api table object. */
    public getXTable(): any {
        return this.xTable
    }

    public async count(): Promise<number> {
        try {
            return await this.xTable.count()
        } catch (error) {
            throw error
        }
    }

    public delete(condition: SearchCondition | SearchConditionString = true): ITableDelete {
        try {
            const conditionString = createConditionString(condition)
            const xTableRemove = this.xTable.delete(conditionString)
            return new TableDelete(this, xTableRemove)
        } catch (error) {
            throw error
        }
    }

    public async existsInDatabase(): Promise<boolean> {
        try {
            return await this.xTable.existsInDatabase()
        } catch (error) {
            throw error
        }
    }

    public getName(): string {
        return this.xTable.getName()
    }

    public insert(fields: string[]): ITableInsert
    public insert(fields: { [k: string]: any }): ITableInsert
    public insert(...fields: string[]): ITableInsert
    public insert(...fields: any[]): ITableInsert {
        try {
            const xTableInsert = this.xTable.insert(...fields)
            return new TableInsert(this, xTableInsert)
        } catch (error) {
            throw error
        }
    }

    public inspect(): Object {
        return this.xTable.inspect()
    }

    public async isView(): Promise<boolean> {
        return await this.xTable.isView()
    }

    /** The Table.select() method works like a SELECT statement in SQL
     *  https://dev.mysql.com/doc/x-devapi-userguide/en/sql-crud-functions.html
     */
    public select(fields: string[]): ITableSelect
    /** The Table.select() method works like a SELECT statement in SQL
     *  https://dev.mysql.com/doc/x-devapi-userguide/en/sql-crud-functions.html
     */
    public select(...fields: string[]): ITableSelect
    /** The Table.select() method works like a SELECT statement in SQL
     *  https://dev.mysql.com/doc/x-devapi-userguide/en/sql-crud-functions.html
     */
    public select(...fields: any[]): ITableSelect {
        try {
            const xTableSelect = this.xTable.select(...fields)
            return new TableSelect(this, xTableSelect)
        } catch (error) {
            throw error
        }
    }

    /** The Table.update() method works like an UPDATE statement in SQL.
     *  https://dev.mysql.com/doc/x-devapi-userguide/en/sql-crud-functions.html
     */
    public update(condition?: SearchCondition | SearchConditionString): ITableUpdate {
        try {
            const conditionString = condition !== void 0 ? createConditionString(condition) : condition
            const xTableUpdate = this.xTable.modify(conditionString)
            return new TableUpdate(this, xTableUpdate)
        } catch (error) {
            throw error
        }
    }
}

export default Table
