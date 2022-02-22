import { ValidationRule } from "./interfaces/validation-rule";
import { ModuleRef } from "@nestjs/core";

export interface RuleNode {
  rule: ValidationRule,
  params: any
}

export class Validator {

  private rules: Map<string, RuleNode[]>;


  constructor(private readonly moduleRef: ModuleRef) {}


  public setRules(rules: Map<string, RuleNode[]>): void {
    this.rules = rules;
  }

  public async validate(): Promise<void> {
    for (let [key, ruleNode] of this.rules) {
        //const ruleInstance  = this.moduleRef.get(ruleNode.rule, {strict: false})
    }
  }
}
