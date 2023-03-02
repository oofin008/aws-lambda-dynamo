export interface ShareConfigSchema {
  UPId: string;
  ConfigId: string;
  ConfigValue: any;
  TargetNLE: Array<string>;
  TargetLOC: Array<string>;
  TargetUser: Array<string>;
}

interface design2 {
  type: 'UP' | 'NLE' | 'LOC' | 'USER'; // PK
  id: string; // SK
  config_id: string;
  config_value: string;
}
