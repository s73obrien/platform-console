import { Renderer2, RendererStyleFlags2, NgModule, RootRenderer, RendererFactory2, RendererType2, NgZone, APP_INITIALIZER, Injectable } from '@angular/core';

export class ConsoleElement {
  constructor(public name: string) { }
  attributes: { [n: string]: string } = {};
  properties: { [n: string]: any } = {};
  children: ConsoleNode[] = [];
  view: ConsoleView | null = null;
}

export class ConsoleText {
  constructor(public value: string) { }
}

export class ConsoleView {
  children: ConsoleNode[] = [];
}

export type ConsoleNode = ConsoleElement | ConsoleText;

export class ConsoleRenderer extends Renderer2 {
  constructor() {
    super();
  }

  public root = new ConsoleElement('root');

  data: { [key: string]: any } = {};
  destroyNode: ((node: ConsoleNode) => void) | null = null;
  destroy(): void { }

  createElement(name: string, namespace?: string): ConsoleElement {
    return new ConsoleElement(name);
  }

  createComment(value: string): ConsoleElement {
    throw new Error('createComment not implemented.');
  }

  createText(value: string): ConsoleText {
    return new ConsoleText(value);
  }

  appendChild(parent: ConsoleElement, newChild: ConsoleNode): void {
    parent.children.push(newChild);
  }

  insertBefore(parent: ConsoleElement, newChild: ConsoleNode, refChild: ConsoleNode): void {
    const i = parent.children.findIndex(n => n === refChild);
    parent.children.splice(i, 0, newChild);
  }

  removeChild(parent: ConsoleElement, oldChild: ConsoleNode): void {
    const i = parent.children.findIndex(n => n === oldChild);
    parent.children.splice(i, 1);
  }

  selectRootElement(selectorOrNode: string, preserveContent?: boolean) {
    this.root = new ConsoleElement(selectorOrNode);
    return this.root;
  }

  parentNode(node: ConsoleNode) {
    throw new Error('parentNode not implemented.');
  }
  nextSibling(node: ConsoleNode) {
    throw new Error('nextSibling not implemented.');
  }

  setAttribute(el: ConsoleElement, name: string, value: string, namespace?: string): void {
    el.attributes[name] = value;
  }

  removeAttribute(el: ConsoleElement, name: string, namespace?: string): void {
    delete el.attributes[name];
  }

  addClass(el: ConsoleElement, name: string): void {
    throw new Error('addClass not implemented.');
  }
  removeClass(el: ConsoleElement, name: string): void {
    throw new Error('removeClass not implemented.');
  }
  setStyle(el: ConsoleElement, style: string, value: any, flags?: RendererStyleFlags2): void {
    throw new Error('setStyle not implemented.');
  }
  removeStyle(el: ConsoleElement, style: string, flags?: RendererStyleFlags2): void {
    throw new Error('removeStyle not implemented.');
  }

  setProperty(el: ConsoleElement, name: string, value: any): void {
    el.properties[name] = value;
  }

  setValue(node: ConsoleNode, value: string): void {
    if (node instanceof ConsoleText) {
      node.value = value;
    } else {
      throw new Error('setValue only implemented for ConsoleNode');
    }
  }

  listen(target: ConsoleNode, eventName: string, callback: (event: any) => boolean | void): () => void {
    throw new Error('listen not implemented.');
  }

}

@Injectable()
export class ConsoleRendererFactory implements RendererFactory2 {
  public defaultRenderer = new ConsoleRenderer();
  createRenderer(hostElement: ConsoleNode, type: RendererType2): Renderer2 {
    return this.defaultRenderer;
  }

  // begin?(): void {
  //   throw new Error('Method not implemented.');
  // }

  // end?(): void {
  //   throw new Error('Method not implemented.');
  // }

  // whenRenderingDone?(): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
}

export function setUpRenderFlushing(zone: NgZone, rendererFactory: ConsoleRendererFactory) {
  return () => {
    zone.onStable.subscribe(() => {
      console.group('--');
      console.log(rendererFactory.defaultRenderer.root);
      console.log(JSON.stringify(rendererFactory.defaultRenderer.root, null, 2));
      console.groupEnd();
    });
  };
}
